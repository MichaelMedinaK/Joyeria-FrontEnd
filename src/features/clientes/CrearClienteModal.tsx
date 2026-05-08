import { useState, useEffect } from 'react';
import { clienteService } from '@shared/services';
import { Cliente } from '@shared/types';

interface CrearClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteCreado: () => void;
  clienteEditar?: Cliente | null;
}

export const CrearClienteModal = ({ isOpen, onClose, onClienteCreado, clienteEditar }: CrearClienteModalProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
  });

  // Cargar datos del cliente cuando se abre en modo edición
  useEffect(() => {
    if (isOpen && clienteEditar) {
      setFormData({
        nombre: clienteEditar.nombre,
        telefono: clienteEditar.telefono,
        direccion: clienteEditar.direccion,
      });
    } else if (isOpen && !clienteEditar) {
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
      });
    }
  }, [isOpen, clienteEditar]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return;
    }

    if (!formData.direccion.trim()) {
      setError('La dirección es obligatoria');
      return;
    }

    try {
      setLoading(true);
      
      if (clienteEditar) {
        await clienteService.update(clienteEditar.id, formData);
      } else {
        await clienteService.create(formData);
      }
      
      // Resetear formulario
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
      });
      
      onClienteCreado();
      onClose();
    } catch (err: any) {
      setError(err.message || `Error al ${clienteEditar ? 'actualizar' : 'crear'} cliente`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        nombre: '',
        telefono: '',
        direccion: '',
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {clienteEditar ? '✏️ Modificar Cliente' : '➕ Crear Nuevo Cliente'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
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

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Cliente <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Juan Pérez"
              maxLength={150}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="3001234567"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Calle 123 #45-67"
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (clienteEditar ? '⏳ Actualizando...' : '⏳ Creando...') 
                : (clienteEditar ? '✅ Actualizar Cliente' : '➕ Crear Cliente')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
