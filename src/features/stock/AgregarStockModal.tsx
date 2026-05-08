import { useState, useEffect } from 'react';
import { Producto, Stock } from '@shared/types';

interface AgregarStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStockAgregado: (data: { idProducto: number; cantidadActual: number; stockMinimo: number; idRevendedor?: number }) => void;
  productos: Producto[];
  esRevendedor?: boolean;
  idRevendedor?: number;
  stockEditar?: Stock | null;
}

export const AgregarStockModal = ({ 
  isOpen, 
  onClose, 
  onStockAgregado, 
  productos,
  esRevendedor = false,
  idRevendedor,
  stockEditar
}: AgregarStockModalProps) => {
  const [formData, setFormData] = useState({
    idProducto: 0,
    cantidadActual: 0,
    stockMinimo: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && stockEditar) {
      // Modo edición
      setFormData({
        idProducto: stockEditar.idProducto,
        cantidadActual: stockEditar.cantidadActual,
        stockMinimo: stockEditar.stockMinimo,
      });
      setError('');
    } else if (isOpen && !stockEditar) {
      // Modo creación
      setFormData({
        idProducto: 0,
        cantidadActual: 0,
        stockMinimo: 0,
      });
      setError('');
    }
  }, [isOpen, stockEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.idProducto) {
      setError('Debe seleccionar un producto');
      return;
    }

    if (formData.cantidadActual < 0) {
      setError('La cantidad no puede ser negativa');
      return;
    }

    onStockAgregado({
      idProducto: formData.idProducto,
      cantidadActual: formData.cantidadActual,
      stockMinimo: formData.stockMinimo,
      ...(esRevendedor && idRevendedor ? { idRevendedor } : {})
    });
    
    onClose();
  };

  const handleClose = () => {
    setFormData({
      idProducto: 0,
      cantidadActual: 0,
      stockMinimo: 0,
    });
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
            {stockEditar ? '✏️ Modificar Stock' : '➕ Agregar Stock'} {esRevendedor ? 'de Revendedor' : 'del Dueño'}
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
              onChange={(e) => setFormData({ ...formData, idProducto: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={!!stockEditar}
            >
              <option value="0">Seleccionar producto...</option>
              {productos.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad Actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad Actual <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.cantidadActual === 0 ? '' : formData.cantidadActual}
              onChange={(e) => setFormData({ ...formData, cantidadActual: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Stock Mínimo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Mínimo (Alerta)
            </label>
            <input
              type="number"
              min="0"
              value={formData.stockMinimo === 0 ? '' : formData.stockMinimo}
              onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value === '' ? 0 : Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Se alertará cuando el stock esté por debajo de este valor
            </p>
          </div>

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
              {stockEditar ? '✅ Actualizar' : '➕ Agregar Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
