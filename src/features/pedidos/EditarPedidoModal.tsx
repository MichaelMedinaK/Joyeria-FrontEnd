import { useState, useEffect } from 'react';
import { Pedido, Cliente, Producto } from '@shared/types';
import { clienteService, productoService } from '@shared/services';
import { AgregarProductoModal } from './AgregarProductoModal';

interface ProductoItem {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface EditarPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoActualizado: () => void;
  pedido: Pedido;
}

export const EditarPedidoModal = ({ isOpen, onClose, onPedidoActualizado, pedido }: EditarPedidoModalProps) => {
  const [formData, setFormData] = useState({
    idCliente: pedido.idCliente.toString(),
    estado: pedido.estado,
    kilometros: pedido.kilometros.toString(),
    fechaEntrega: pedido.fechaEntrega || '',
    rangoHorario: pedido.rangoHorario || '',
    tipoPago: pedido.tipoPago || '',
    efectivo: pedido.efectivo?.toString() || '0',
    transferencia: pedido.transferencia?.toString() || '0',
  });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [items, setItems] = useState<ProductoItem[]>([]);
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productoEditarIndex, setProductoEditarIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Resetear form data con los datos del pedido actual
      setFormData({
        idCliente: pedido.idCliente.toString(),
        estado: pedido.estado,
        kilometros: pedido.kilometros.toString(),
        fechaEntrega: pedido.fechaEntrega || '',
        rangoHorario: pedido.rangoHorario || '',
        tipoPago: pedido.tipoPago || '',
        efectivo: pedido.efectivo?.toString() || '0',
        transferencia: pedido.transferencia?.toString() || '0',
      });
      // Cargar productos del pedido
      setItems(pedido.detalles.map(detalle => ({
        idProducto: detalle.idProducto,
        nombre: detalle.nombreProducto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal
      })));
    }
  }, [isOpen, pedido]);

  const loadData = async () => {
    try {
      const [clientesData, productosData] = await Promise.all([
        clienteService.getAll(),
        productoService.getActivos()
      ]);
      setClientes(clientesData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fechaEntrega) {
      alert('La fecha de entrega es obligatoria');
      return;
    }
    
    if (!formData.rangoHorario) {
      alert('El rango horario es obligatorio');
      return;
    }

    if (items.length === 0) {
      alert('Debe tener al menos un producto en el pedido');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const updateData: any = {};
      
      // Solo agregar campos que cambiaron
      if (parseInt(formData.idCliente) !== pedido.idCliente) {
        updateData.idCliente = parseInt(formData.idCliente);
      }
      
      if (formData.estado !== pedido.estado) {
        updateData.estado = formData.estado;
      }
      
      if (parseFloat(formData.kilometros) !== pedido.kilometros) {
        updateData.kilometros = parseFloat(formData.kilometros);
      }
      
      if (formData.fechaEntrega !== pedido.fechaEntrega) {
        updateData.fechaEntrega = formData.fechaEntrega;
      }
      
      if (formData.rangoHorario !== pedido.rangoHorario) {
        updateData.rangoHorario = formData.rangoHorario;
      }

      // Tipo de pago
      if (formData.tipoPago !== pedido.tipoPago) {
        updateData.tipoPago = formData.tipoPago;
      }

      // Efectivo
      const efectivoActual = parseFloat(formData.efectivo) || 0;
      const efectivoOriginal = pedido.efectivo || 0;
      if (efectivoActual !== efectivoOriginal) {
        updateData.efectivo = efectivoActual;
      }

      // Transferencia
      const transferenciaActual = parseFloat(formData.transferencia) || 0;
      const transferenciaOriginal = pedido.transferencia || 0;
      if (transferenciaActual !== transferenciaOriginal) {
        updateData.transferencia = transferenciaActual;
      }

      // Verificar si los productos cambiaron
      const productosOriginales = pedido.detalles.map(d => ({ id: d.idProducto, cant: d.cantidad }));
      const productosActuales = items.map(i => ({ id: i.idProducto, cant: i.cantidad }));
      
      const productosIguales = productosOriginales.length === productosActuales.length &&
        productosOriginales.every((po, idx) => 
          po.id === productosActuales[idx].id && po.cant === productosActuales[idx].cant
        );

      if (!productosIguales) {
        updateData.detalles = items.map(item => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad
        }));
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/${pedido.idPedido}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar pedido');
      }

      alert('✅ Pedido actualizado exitosamente');
      onPedidoActualizado();
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar pedido:', error);
      alert('❌ Error al actualizar pedido: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">✏️ Editar Pedido #{pedido.idPedido}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              value={formData.idCliente}
              onChange={(e) => setFormData({ ...formData, idCliente: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre} - {cliente.telefono}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="PENDIENTE">⏳ Pendiente</option>
              <option value="EN_PROCESO">📦 En Proceso</option>
              <option value="EN_CAMINO">🚚 En Camino</option>
              <option value="ENTREGADO">✔️ Entregado</option>
              <option value="CANCELADO">❌ Cancelado</option>
            </select>
          </div>

          {/* Grid: Kilómetros, Fecha, Horario */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Kilómetros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilómetros
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.kilometros}
                onChange={(e) => setFormData({ ...formData, kilometros: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Fecha de Entrega */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Entrega *
              </label>
              <input
                type="date"
                value={formData.fechaEntrega}
                onChange={(e) => setFormData({ ...formData, fechaEntrega: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            {/* Rango Horario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horario *
              </label>
              <select
                value={formData.rangoHorario}
                onChange={(e) => setFormData({ ...formData, rangoHorario: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Seleccionar...</option>
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
                disabled={loading}
              >
                <option value="">Seleccionar...</option>
                <option value="EFECTIVO">💵 Efectivo</option>
                <option value="TRANSFERENCIA">🏦 Transferencia</option>
                <option value="MIXTO">💳 Mixto</option>
              </select>
            </div>

            {/* Monto en Efectivo - Solo si es EFECTIVO o MIXTO */}
            {(formData.tipoPago === 'EFECTIVO' || formData.tipoPago === 'MIXTO') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💵 Monto en Efectivo
                </label>
                <input
                  type="number"
                  value={formData.efectivo}
                  onChange={(e) => setFormData({ ...formData, efectivo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Monto en Transferencia - Solo si es TRANSFERENCIA o MIXTO */}
            {(formData.tipoPago === 'TRANSFERENCIA' || formData.tipoPago === 'MIXTO') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏦 Monto en Transferencia
                </label>
                <input
                  type="number"
                  value={formData.transferencia}
                  onChange={(e) => setFormData({ ...formData, transferencia: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Productos */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-xl">🛒</span>
                Productos ({items.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                disabled={loading}
              >
                ➕ Agregar
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <p className="text-sm">No hay productos</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900">{item.nombre}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                          <span>Cant: <strong>{item.cantidad}</strong></span>
                          <span className="text-gray-400">•</span>
                          <span>Precio: <strong>${item.precioUnitario.toLocaleString()}</strong></span>
                          <span className="text-gray-400">•</span>
                          <span className="text-primary-600 font-bold">${item.subtotal.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditarProducto(index)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
                          disabled={loading}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                          disabled={loading}
                          title="Eliminar"
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

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

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
