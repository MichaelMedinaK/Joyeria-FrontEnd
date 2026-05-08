import { useState, useEffect } from 'react';
import { productoService } from '@shared/services';
import { Producto } from '@shared/types';

interface EditarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductoActualizado: () => void;
  producto: Producto;
}

export const EditarProductoModal = ({ isOpen, onClose, onProductoActualizado, producto }: EditarProductoModalProps) => {
  const [formData, setFormData] = useState({
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precioCompra: producto.precio_compra.toString(),
    precioVenta: producto.precio_venta.toString(),
    activo: producto.activo,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precioCompra: producto.precio_compra.toString(),
        precioVenta: producto.precio_venta.toString(),
        activo: producto.activo,
      });
    }
  }, [isOpen, producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (!formData.precioVenta || parseFloat(formData.precioVenta) <= 0) {
      alert('El precio de venta debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      await productoService.actualizar(producto.id, {
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        precioCompra: parseFloat(formData.precioCompra) || 0,
        precioVenta: parseFloat(formData.precioVenta),
        activo: formData.activo,
      });

      alert('✅ Producto actualizado exitosamente');
      onProductoActualizado();
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar producto:', error);
      alert('❌ Error al actualizar producto: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">✏️ Editar Producto</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ej: Anillo de oro 18k"
              disabled={loading}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Descripción del producto..."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Precio de Compra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Compra
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={formData.precioCompra}
                onChange={(e) => setFormData({ ...formData, precioCompra: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>

          {/* Precio de Venta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Venta *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                value={formData.precioVenta}
                onChange={(e) => setFormData({ ...formData, precioVenta: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Estado Activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo-edit"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              disabled={loading}
            />
            <label htmlFor="activo-edit" className="ml-2 text-sm text-gray-700">
              Producto activo (disponible para pedidos)
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : '✅ Actualizar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
