import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productoService, clienteService, pedidoService } from '@shared/services';
import { Producto, Cliente } from '@shared/types';
import { CrearClienteModal } from '../clientes/CrearClienteModal';
import { AgregarProductoModal } from './AgregarProductoModal';

interface ProductoItem {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export const CrearPedidoPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProductoItem[]>([]);
  const [formData, setFormData] = useState({
    idCliente: '',
    kilometros: '',
    fechaEntrega: '',
    rangoHorario: '',
    tipoPago: '',
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCrearClienteModal, setShowCrearClienteModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [showEditarClienteModal, setShowEditarClienteModal] = useState(false);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productoEditarIndex, setProductoEditarIndex] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientesData, productosData] = await Promise.all([
        clienteService.getAll(),
        productoService.getActivos()
      ]);
      setClientes(clientesData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClienteCreado = async () => {
    // Recargar la lista de clientes
    const clientesData = await clienteService.getAll();
    setClientes(clientesData);
  };

  const handleClienteChange = (idCliente: string) => {
    setFormData({ ...formData, idCliente });
    if (idCliente) {
      const cliente = clientes.find(c => c.id === parseInt(idCliente));
      setClienteSeleccionado(cliente || null);
    } else {
      setClienteSeleccionado(null);
    }
  };

  const handleEditarCliente = () => {
    setShowEditarClienteModal(true);
  };

  const handleClienteActualizado = async () => {
    // Recargar la lista de clientes
    const clientesData = await clienteService.getAll();
    setClientes(clientesData);
    // Actualizar el cliente seleccionado
    if (clienteSeleccionado) {
      const clienteActualizado = clientesData.find(c => c.id === clienteSeleccionado.id);
      setClienteSeleccionado(clienteActualizado || null);
    }
  };

  const handleAddItem = () => {
    setProductoEditarIndex(null);
    setShowProductoModal(true);
  };

  const handleEditarProducto = (index: number) => {
    setProductoEditarIndex(index);
    setShowProductoModal(true);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleProductoAgregado = (producto: ProductoItem) => {
    if (productoEditarIndex !== null) {
      // Modo edición
      const newItems = [...items];
      newItems[productoEditarIndex] = producto;
      setItems(newItems);
      setProductoEditarIndex(null);
    } else {
      // Modo agregar
      setItems([...items, producto]);
    }
  };

  const calcularSubtotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularDelivery = () => {
    const km = parseFloat(formData.kilometros) || 0;
    return km * 1000; // $1000 por kilómetro
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularDelivery();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.idCliente) {
      alert('Debe seleccionar un cliente');
      return;
    }
    
    if (!formData.fechaEntrega) {
      alert('Debe seleccionar una fecha de entrega');
      return;
    }
    
    if (!formData.rangoHorario || formData.rangoHorario.trim() === '') {
      alert('Debe especificar un rango horario');
      return;
    }
    
    if (!formData.tipoPago || formData.tipoPago.trim() === '') {
      alert('Debe seleccionar un tipo de pago');
      return;
    }
    
    if (items.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }

    try {
      // Crear pedido en el backend
      await pedidoService.crear({
        idCliente: parseInt(formData.idCliente),
        kilometros: parseFloat(formData.kilometros) || 0,
        fechaEntrega: formData.fechaEntrega,
        rangoHorario: formData.rangoHorario,
        tipoPago: formData.tipoPago,
        detalles: items.map(item => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad
        }))
      });

      alert('✅ Pedido creado exitosamente');
      // Navegar de vuelta a pedidos
      navigate('/pedidos');
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      alert('❌ Error al crear pedido: ' + (error.message || 'Error desconocido'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/pedidos')}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Crear Nuevo Pedido</h1>
        </div>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Registra un pedido con carrito de compras</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Pedido */}
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Información del Pedido
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                value={formData.idCliente}
                onChange={(e) => handleClienteChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.telefono} - {cliente.direccion}
                  </option>
                ))}
              </select>
              
              {/* Botones de acción */}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => setShowCrearClienteModal(true)}
                >
                  ➕ Crear nuevo cliente
                </button>
                
                {clienteSeleccionado && (
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                    onClick={handleEditarCliente}
                  >
                    ✏️ Modificar Cliente
                  </button>
                )}
              </div>
              
              {/* Información del cliente seleccionado */}
              {clienteSeleccionado && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{clienteSeleccionado.nombre}</p>
                  <p className="text-xs text-gray-600">📞 {clienteSeleccionado.telefono}</p>
                  <p className="text-xs text-gray-600">📍 {clienteSeleccionado.direccion}</p>
                </div>
              )}
            </div>

            {/* Kilómetros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilómetros para delivery
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.kilometros}
                onChange={(e) => setFormData({ ...formData, kilometros: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Costo: ${calcularDelivery().toLocaleString()} ($1000 x km)
              </p>
            </div>

            {/* Fecha de Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Entrega *
              </label>
              <input
                type="date"
                value={formData.fechaEntrega}
                onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Rango Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango Horario *
              </label>
              <select
                value={formData.rangoHorario}
                onChange={(e) => setFormData({ ...formData, rangoHorario: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar horario...</option>
                <option value="11:00 - 12:00">11:00 - 12:00</option>
                <option value="12:00 - 13:00">12:00 - 13:00</option>
                <option value="13:00 - 14:00">13:00 - 14:00</option>
                <option value="14:00 - 15:00">14:00 - 15:00</option>
                <option value="15:00 - 16:00">15:00 - 16:00</option>
                <option value="16:00 - 17:00">16:00 - 17:00</option>
                <option value="17:00 - 18:00">17:00 - 18:00</option>
                <option value="18:00 - 19:00">18:00 - 19:00</option>
                <option value="19:00 - 20:00">19:00 - 20:00</option>
                <option value="20:00 - 21:00">20:00 - 21:00</option>
                <option value="21:00 - 22:00">21:00 - 22:00</option>
                <option value="22:00 - 23:00">22:00 - 23:00</option>
                <option value="23:00 - 00:00">23:00 - 00:00</option>
                <option value="00:00 - 01:00">00:00 - 01:00</option>
                <option value="01:00 - 02:00">01:00 - 02:00</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Selecciona el rango de 1 hora para la entrega
              </p>
            </div>

            {/* Tipo de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pago *
              </label>
              <select
                value={formData.tipoPago}
                onChange={(e) => setFormData({ ...formData, tipoPago: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar tipo de pago...</option>
                <option value="EFECTIVO">💵 Efectivo</option>
                <option value="TRANSFERENCIA">🏦 Transferencia</option>
                <option value="MIXTO">💳 Mixto (Efectivo + Transferencia)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Los montos se completarán al editar el pedido
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              Productos ({items.length})
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors text-sm"
            >
              ➕ Agregar Producto
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm">No hay productos agregados</p>
              <p className="text-xs mt-1">Haz clic en "Agregar Producto" para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-4">
                    {/* Información del producto */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900">{item.nombre}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Cantidad:</span>
                              <span className="font-bold text-gray-900">{item.cantidad}</span>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Precio:</span>
                              <span className="font-bold text-gray-900">${item.precioUnitario.toLocaleString()}</span>
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Subtotal:</span>
                              <span className="font-bold text-primary-600">${item.subtotal.toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditarProducto(index)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                        title="Modificar producto"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen */}
        <div className="card bg-gradient-to-br from-primary-50 to-blue-50">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            Resumen del Pedido
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">${calcularSubtotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Costo de Delivery:</span>
              <span className="font-semibold">${calcularDelivery().toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-primary-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-primary-600">${calcularTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate('/pedidos')}
            className="flex-1 btn-secondary py-3"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary py-3"
          >
            Crear Pedido
          </button>
        </div>
      </form>

      {/* Modal Crear Cliente */}
      <CrearClienteModal
        isOpen={showCrearClienteModal}
        onClose={() => setShowCrearClienteModal(false)}
        onClienteCreado={handleClienteCreado}
      />

      {/* Modal Editar Cliente */}
      <CrearClienteModal
        isOpen={showEditarClienteModal}
        onClose={() => setShowEditarClienteModal(false)}
        onClienteCreado={handleClienteActualizado}
        clienteEditar={clienteSeleccionado}
      />

      {/* Modal Agregar/Editar Producto */}
      <AgregarProductoModal
        isOpen={showProductoModal}
        onClose={() => {
          setShowProductoModal(false);
          setProductoEditarIndex(null);
        }}
        onProductoAgregado={handleProductoAgregado}
        productos={productos}
        productoEditar={productoEditarIndex !== null ? items[productoEditarIndex] : null}
      />
    </div>
  );
};
