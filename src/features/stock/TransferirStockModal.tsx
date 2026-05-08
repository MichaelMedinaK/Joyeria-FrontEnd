import { useState, useEffect } from 'react';
import { Producto, Revendedor } from '@shared/types';

interface TransferirStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStockTransferido: (data: { idProducto: number; idRevendedor: number; cantidad: number }) => void;
  productos: Producto[];
  revendedores: Revendedor[];
}

export const TransferirStockModal = ({ 
  isOpen, 
  onClose, 
  onStockTransferido, 
  productos,
  revendedores
}: TransferirStockModalProps) => {
  const [formData, setFormData] = useState({
    idProducto: 0,
    idRevendedor: 0,
    cantidad: 1,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        idProducto: 0,
        idRevendedor: 0,
        cantidad: 1,
      });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.idProducto) {
      setError('Debe seleccionar un producto');
      return;
    }

    if (!formData.idRevendedor) {
      setError('Debe seleccionar un revendedor');
      return;
    }

    if (formData.cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    onStockTransferido({
      idProducto: formData.idProducto,
      idRevendedor: formData.idRevendedor,
      cantidad: formData.cantidad,
    });
    
    onClose();
  };

  const handleClose = () => {
    setFormData({
      idProducto: 0,
      idRevendedor: 0,
      cantidad: 1,
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
            🔄 Transferir Stock a Revendedor
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
            >
              <option value="0">Seleccionar producto...</option>
              {productos.map(producto => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Revendedor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revendedor <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.idRevendedor}
              onChange={(e) => setFormData({ ...formData, idRevendedor: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="0">Seleccionar revendedor...</option>
              {revendedores.filter(r => r.activo).map(revendedor => (
                <option key={revendedor.idRevendedor} value={revendedor.idRevendedor}>
                  {revendedor.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad a Transferir <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value === '' ? 1 : Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Se descontará esta cantidad del stock del dueño
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
              className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              🔄 Transferir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
