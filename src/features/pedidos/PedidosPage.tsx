import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pedido } from '@shared/types';
import { pedidoService } from '@shared/services';
import { EditarPedidoModal } from './EditarPedidoModal';

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getHoy = () => {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
};

// Función para formatear fecha legible
const formatFecha = (fecha: string) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const PedidosPage = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState(getHoy());
  const [fechaHasta, setFechaHasta] = useState(getHoy());
  const [estadoFiltro, setEstadoFiltro] = useState<string>('TODOS');
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [showFiltroFecha, setShowFiltroFecha] = useState(false);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getByFechas(fechaDesde, fechaHasta);
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      alert('Error al cargar pedidos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    loadPedidos();
  };

  const handleLimpiar = () => {
    setFechaDesde(getHoy());
    setFechaHasta(getHoy());
    setEstadoFiltro('TODOS');
  };

  const handleEditarPedido = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setShowEditarModal(true);
  };

  const handlePedidoActualizado = () => {
    loadPedidos();
  };

  const generarDescripcionPedido = (pedido: Pedido) => {
    const fechaEntregaFormat = pedido.fechaEntrega 
      ? new Date(pedido.fechaEntrega).toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        })
      : 'No especificada';

    const descripcion = `👤 Cliente: ${pedido.nombreCliente}
📅 Fecha de Entrega: ${fechaEntregaFormat}
🕐 Horario: ${pedido.rangoHorario || 'No especificado'}
💰 Total: $${pedido.total.toLocaleString()}
🚚 Envío: ${pedido.kilometros} km
📋 Estado: ${pedido.estado}`;

    return descripcion;
  };

  const copiarDescripcion = async (pedido: Pedido) => {
    try {
      const descripcion = generarDescripcionPedido(pedido);
      await navigator.clipboard.writeText(descripcion);
      alert('✅ Descripción copiada al portapapeles');
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('❌ Error al copiar la descripción');
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (estadoFiltro === 'TODOS') return true;
    return pedido.estado === estadoFiltro;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Pedidos</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Gestión de pedidos y ventas a clientes</p>
      </div>

      {/* Botón Crear Pedido - Destacado */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/pedidos/nuevo')}
          className="w-full sm:w-auto btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Crear Nuevo Pedido</span>
        </button>
      </div>

      {/* Card Principal */}
      <div className="card">
        {/* Filtros */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por estado:</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setEstadoFiltro('TODOS')}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                estadoFiltro === 'TODOS' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Todos
            </button>
            <button 
              onClick={() => setEstadoFiltro('PENDIENTE')}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                estadoFiltro === 'PENDIENTE' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Pendientes
            </button>
            <button 
              onClick={() => setEstadoFiltro('EN_PROCESO')}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                estadoFiltro === 'EN_PROCESO' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 En Proceso
            </button>
            <button 
              onClick={() => setEstadoFiltro('EN_CAMINO')}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                estadoFiltro === 'EN_CAMINO' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚚 En Camino
            </button>
            <button 
              onClick={() => setEstadoFiltro('ENTREGADO')}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                estadoFiltro === 'ENTREGADO' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✔️ Entregados
            </button>
            <button 
              onClick={() => setEstadoFiltro('CANCELADO')}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors ${
                estadoFiltro === 'CANCELADO' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❌ Cancelados
            </button>
          </div>
        </div>

        {/* Filtro por Fecha - Desplegable */}
        <div className="mb-6">
          <button
            onClick={() => setShowFiltroFecha(!showFiltroFecha)}
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="text-sm font-semibold text-gray-700">Filtrar por fecha</span>
              {fechaDesde !== getHoy() || fechaHasta !== getHoy() ? (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              ) : null}
            </div>
            <svg 
              className={`w-5 h-5 text-gray-600 transition-transform ${showFiltroFecha ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Contenido del filtro (colapsable) */}
          {showFiltroFecha && (
            <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Desde:</label>
                  <input 
                    type="date" 
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Hasta:</label>
                  <input 
                    type="date" 
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2 flex items-end gap-2">
                  <button 
                    onClick={handleBuscar}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    🔍 Buscar
                  </button>
                  <button 
                    onClick={handleLimpiar}
                    className="flex-1 btn-secondary text-sm py-2"
                  >
                    🔄 Limpiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="mb-6 border-b border-gray-200"></div>

        {/* Lista de Pedidos */}
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="text-5xl sm:text-6xl mb-4">🛒</div>
            <p className="text-base sm:text-lg font-semibold">No hay pedidos para mostrar</p>
            <p className="text-xs sm:text-sm mt-2">
              {estadoFiltro === 'TODOS' 
                ? 'No hay pedidos en este rango de fechas'
                : `No hay pedidos con estado "${estadoFiltro}"`}
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
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Entrega
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.idPedido} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{pedido.idPedido}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{pedido.nombreCliente}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatFecha(pedido.fechaPedido)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString('es-ES') : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pedido.rangoHorario || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-bold text-gray-900">${pedido.total.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">KM: {pedido.kilometros}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          pedido.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                          pedido.estado === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
                          pedido.estado === 'EN_CAMINO' ? 'bg-purple-100 text-purple-800' :
                          pedido.estado === 'ENTREGADO' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditarPedido(pedido)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                            title="Editar pedido"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => copiarDescripcion(pedido)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
                            title="Copiar descripción del pedido"
                          >
                            📋 Copiar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="md:hidden space-y-3">
              {pedidosFiltrados.map((pedido) => (
                <div 
                  key={pedido.idPedido} 
                  className="rounded-lg p-4 border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">Pedido #{pedido.idPedido}</h3>
                      <p className="text-sm text-gray-600">{pedido.nombreCliente}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      pedido.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                      pedido.estado === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
                      pedido.estado === 'EN_CAMINO' ? 'bg-purple-100 text-purple-800' :
                      pedido.estado === 'ENTREGADO' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {pedido.estado}
                    </span>
                  </div>
                  
                  {/* Información de entrega */}
                  {(pedido.fechaEntrega || pedido.rangoHorario) && (
                    <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      {pedido.fechaEntrega && (
                        <p className="text-xs text-gray-700">
                          📅 Entrega: {new Date(pedido.fechaEntrega).toLocaleDateString('es-ES')}
                        </p>
                      )}
                      {pedido.rangoHorario && (
                        <p className="text-xs text-gray-700">
                          🕐 Horario: {pedido.rangoHorario}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-bold text-gray-900">${pedido.total.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{formatFecha(pedido.fechaPedido)}</p>
                      <p className="text-xs text-gray-500">KM: {pedido.kilometros}</p>
                    </div>
                  </div>
                  
                  {/* Botón editar */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => handleEditarPedido(pedido)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => copiarDescripcion(pedido)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Editar Pedido */}
      {pedidoSeleccionado && (
        <EditarPedidoModal
          isOpen={showEditarModal}
          onClose={() => {
            setShowEditarModal(false);
            setPedidoSeleccionado(null);
          }}
          onPedidoActualizado={handlePedidoActualizado}
          pedido={pedidoSeleccionado}
        />
      )}
    </div>
  );
};
