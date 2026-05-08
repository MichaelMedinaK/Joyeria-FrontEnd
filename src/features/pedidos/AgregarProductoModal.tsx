import { useState, useEffect } from 'react';
import { Producto } from '@shared/types';

interface ProductoItem {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface AgregarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductoAgregado: (producto: ProductoItem) => void;
  productos: Producto[];
  productoEditar?: ProductoItem | null;
}

export const AgregarProductoModal = ({ 
  isOpen, 
  onClose, 
  onProductoAgregado, 
  productos,
  productoEditar 
}: AgregarProductoModalProps) => {
  const [formData, setFormData] = useState({
    idProducto: 0,
    cantidad: 1,
  });
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [error, setError] = useState('');

  // Cargar datos del producto cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && productoEditar) {
      setFormData({
        idProducto: productoEditar.idProducto,
        cantidad: productoEditar.cantidad,
      });
      const prod = productos.find(p => p.id === productoEditar.idProducto);
      setProductoSeleccionado(prod || null);
    } else if (isOpen && !productoEditar) {
      setFormData({
        idProducto: 0,
        cantidad: 1,
      });
      setProductoSeleccionado(null);
    }
  }, [isOpen, productoEditar, productos]);

  const incrementarCantidad = () => {
    setFormData({ ...formData, cantidad: formData.cantidad + 1 });
  };

  const decrementarCantidad = () => {
    if (formData.cantidad > 1) {
      setFormData({ ...formData, cantidad: formData.cantidad - 1 });
    }
  };

  const handleProductoChange = (idProducto: number) => {
    const producto = productos.find(p => p.id === idProducto);
    if (producto) {
      setFormData({
        ...formData,
        idProducto: producto.id,
      });
      setProductoSeleccionado(producto);
    }
  };

  const calcularSubtotal = () => {
    if (!productoSeleccionado) return 0;
    return formData.cantidad * productoSeleccionado.precio_venta;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.idProducto) {
      setError('Debe seleccionar un producto');
      return;
    }

    if (formData.cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    const producto = productos.find(p => p.id === formData.idProducto);
    if (!producto) {
      setError('Producto no válido');
      return;
    }

    const productoItem: ProductoItem = {
      idProducto: formData.idProducto,
      nombre: producto.nombre,
      cantidad: formData.cantidad,
      precioUnitario: producto.precio_venta,
      subtotal: calcularSubtotal(),
    };

    onProductoAgregado(productoItem);
    
    // Resetear formulario
    setFormData({
      idProducto: 0,
      cantidad: 1,
    });
    setProductoSeleccionado(null);
    
    onClose();
  };

  const handleClose = () => {
    setFormData({
      idProducto: 0,
      cantidad: 1,
    });
    setProductoSeleccionado(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {productoEditar ? '✏️ Modificar Producto' : '➕ Agregar Producto'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Producto <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.idProducto}
              onChange={(e) => handleProductoChange(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="0">Seleccionar producto...</option>
              {productos.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - ${producto.precio_venta.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Precio (solo lectura) */}
          {productoSeleccionado && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio Unitario
              </label>
              <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-700 font-semibold">
                ${productoSeleccionado.precio_venta.toLocaleString()}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={decrementarCantidad}
                className="w-12 h-12 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xl rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.cantidad <= 1}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value === '' ? 1 : Number(e.target.value) })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={incrementarCantidad}
                className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Subtotal (solo lectura) */}
          {productoSeleccionado && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtotal
              </label>
              <div className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900 font-bold text-xl">
                ${calcularSubtotal().toLocaleString()}
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              {productoEditar ? '✅ Actualizar' : '➕ Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
