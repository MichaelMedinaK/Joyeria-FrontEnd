import { useState, useEffect } from 'react';
import { Cliente } from '@shared/types';
import { clienteService } from '@shared/services';
import { CrearClienteModal } from './CrearClienteModal';

export const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setClientesFiltrados(clientes);
    } else {
      const filtered = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.telefono.includes(searchTerm) ||
        cliente.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setClientesFiltrados(filtered);
    }
  }, [searchTerm, clientes]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoCliente = () => {
    setClienteEditar(null);
    setShowModal(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditar(cliente);
    setShowModal(true);
  };

  const handleClienteGuardado = () => {
    loadClientes();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Clientes</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Base de datos de clientes</p>
      </div>

      {/* Botón Nuevo Cliente */}
      <div className="mb-6">
        <button 
          onClick={handleNuevoCliente}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>➕ Crear Cliente</span>
        </button>
      </div>

      {/* Card Principal */}
      <div className="card">
        {/* Buscador */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar cliente:</label>
          <div className="relative">
            <input
              type="search"
              placeholder="Nombre, teléfono, dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Lista de Clientes */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-500">Cargando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="text-5xl sm:text-6xl mb-4">👥</div>
            <p className="text-base sm:text-lg font-semibold">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
            <p className="text-xs sm:text-sm mt-2">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Agrega tu primer cliente para comenzar'}
            </p>
          </div>
        ) : (
          <>
            {/* Vista Desktop - Tabla */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dirección
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{cliente.telefono}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{cliente.direccion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleEditarCliente(cliente)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors gap-1"
                        >
                          <span>✏️</span>
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-4">
              {clientesFiltrados.map((cliente) => (
                <div key={cliente.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900">{cliente.nombre}</h3>
                    </div>
                    <button
                      onClick={() => handleEditarCliente(cliente)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      ✏️ Editar
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">📞</span>
                      <span>{cliente.telefono}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                      <span className="font-medium">📍</span>
                      <span>{cliente.direccion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total de clientes */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
              {clientesFiltrados.length === 1 
                ? '1 cliente encontrado' 
                : `${clientesFiltrados.length} clientes encontrados`}
            </div>
          </>
        )}
      </div>

      {/* Modal Crear/Editar Cliente */}
      <CrearClienteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setClienteEditar(null);
        }}
        onClienteCreado={handleClienteGuardado}
        clienteEditar={clienteEditar}
      />
    </div>
  );
};
