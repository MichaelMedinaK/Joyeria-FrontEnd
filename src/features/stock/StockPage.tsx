import { useState, useEffect } from 'react';
import { Stock, Producto, Revendedor } from '@shared/types';
import { stockService, productoService, revendedorService } from '@shared/services';
import { AgregarStockModal } from './AgregarStockModal';
import { TransferirStockModal } from './TransferirStockModal';

export const StockPage = () => {
  const [tabActivo, setTabActivo] = useState<'dueno' | 'revendedor'>('dueno');
  const [stockDueno, setStockDueno] = useState<Stock[]>([]);
  const [revendedorSeleccionado, setRevendedorSeleccionado] = useState<number | null>(null);
  const [stockRevendedor, setStockRevendedor] = useState<Stock[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [revendedores, setRevendedores] = useState<Revendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTransferirModal, setShowTransferirModal] = useState(false);
  const [stockEditar, setStockEditar] = useState<Stock | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (revendedorSeleccionado) {
      loadStockRevendedor(revendedorSeleccionado);
    }
  }, [revendedorSeleccionado]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stockDuenoData, productosData, revendedoresData] = await Promise.all([
        stockService.getStockDueno(),
        productoService.getAll(),
        revendedorService.getAll()
      ]);
      setStockDueno(stockDuenoData);
      setProductos(productosData);
      setRevendedores(revendedoresData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const loadStockRevendedor = async (idRevendedor: number) => {
    try {
      const data = await stockService.getStockRevendedor(idRevendedor);
      setStockRevendedor(data);
    } catch (error) {
      console.error('Error al cargar stock del revendedor:', error);
    }
  };

  const handleAgregarStock = async (data: { idProducto: number; cantidadActual: number; stockMinimo: number; idRevendedor?: number }) => {
    try {
      await stockService.createOrUpdate({
        idProducto: data.idProducto,
        cantidadActual: data.cantidadActual,
        stockMinimo: data.stockMinimo,
        idRevendedor: data.idRevendedor || null
      });
      
      alert(stockEditar ? '✅ Stock actualizado exitosamente' : '✅ Stock agregado exitosamente');
      setStockEditar(null);
      
      // Recargar stock correspondiente
      if (data.idRevendedor && revendedorSeleccionado) {
        await loadStockRevendedor(revendedorSeleccionado);
      } else {
        const stockDuenoData = await stockService.getStockDueno();
        setStockDueno(stockDuenoData);
      }
    } catch (error: any) {
      console.error('Error al guardar stock:', error);
      alert('❌ Error al guardar stock: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleTransferir = async (data: { idProducto: number; idRevendedor: number; cantidad: number }) => {
    try {
      await stockService.transferir(data);
      
      alert('✅ Stock transferido exitosamente');
      
      // Recargar stock del dueño
      const stockDuenoData = await stockService.getStockDueno();
      setStockDueno(stockDuenoData);
      
      // Si está viendo el revendedor al que se transfirió, recargar
      if (revendedorSeleccionado === data.idRevendedor) {
        await loadStockRevendedor(data.idRevendedor);
      }
    } catch (error: any) {
      console.error('Error al transferir stock:', error);
      alert('❌ Error al transferir stock: ' + (error.message || 'Error desconocido'));
    }
  };

  const handleRevendedorChange = (idRevendedor: string) => {
    const id = parseInt(idRevendedor);
    setRevendedorSeleccionado(id || null);
  };

  const handleEditarStock = (stock: Stock) => {
    setStockEditar(stock);
    setShowAgregarModal(true);
  };

  const handleCloseModal = () => {
    setShowAgregarModal(false);
    setStockEditar(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Stock</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Control de inventario general y por revendedor</p>
      </div>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button 
          onClick={() => setShowAgregarModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Stock</span>
        </button>
        <button 
          onClick={() => setShowTransferirModal(true)}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span>Transferir a Revendedor</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTabActivo('dueno')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            tabActivo === 'dueno'
              ? 'text-primary-600 border-primary-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          📦 Stock del Dueño
        </button>
        <button
          onClick={() => setTabActivo('revendedor')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            tabActivo === 'revendedor'
              ? 'text-primary-600 border-primary-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          🤝 Stock por Revendedor
        </button>
      </div>

      {/* Contenido de Tabs */}
      {tabActivo === 'dueno' ? (
        <div className="card">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📦</span>
            Stock del Dueño
          </h2>

          {stockDueno.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-base font-semibold">No hay stock registrado</p>
              <p className="text-sm mt-2">Agrega productos al inventario para comenzar</p>
            </div>
          ) : (
            <>
              {/* Vista Desktop - Tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mínimo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockDueno.map((stock) => (
                      <tr key={stock.idStock} className={stock.stockBajo ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{stock.nombreProducto}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-bold text-gray-900">{stock.cantidadActual}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-600">{stock.stockMinimo}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {stock.stockBajo ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ⚠️ Stock Bajo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✅ Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Mobile - Cards */}
              <div className="md:hidden space-y-3">
                {stockDueno.map((stock) => (
                  <div 
                    key={stock.idStock} 
                    className={`rounded-lg p-4 border ${
                      stock.stockBajo ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h3 className="font-bold text-gray-900 mb-2">{stock.nombreProducto}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Cantidad</p>
                        <p className="text-2xl font-bold text-gray-900">{stock.cantidadActual}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Mínimo</p>
                        <p className="text-lg text-gray-600">{stock.stockMinimo}</p>
                      </div>
                      <div>
                        {stock.stockBajo ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ⚠️ Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ OK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Revendedor
            </label>
            <select
              value={revendedorSeleccionado || ''}
              onChange={(e) => handleRevendedorChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Seleccionar revendedor...</option>
              {revendedores.filter(r => r.activo).map(revendedor => (
                <option key={revendedor.idRevendedor} value={revendedor.idRevendedor}>
                  {revendedor.nombre}
                </option>
              ))}
            </select>
          </div>

          {!revendedorSeleccionado ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-4">🤝</div>
              <p className="text-base font-semibold">Selecciona un revendedor</p>
              <p className="text-sm mt-2">Para ver su stock asignado</p>
            </div>
          ) : stockRevendedor.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-base font-semibold">Sin stock asignado</p>
              <p className="text-sm mt-2">Este revendedor no tiene productos asignados</p>
            </div>
          ) : (
            <>
              {/* Vista Desktop - Tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mínimo
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
                    {stockRevendedor.map((stock) => (
                      <tr key={stock.idStock} className={stock.stockBajo ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{stock.nombreProducto}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-bold text-gray-900">{stock.cantidadActual}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-600">{stock.stockMinimo}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {stock.stockBajo ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              ⚠️ Stock Bajo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✅ Normal
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEditarStock(stock)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            ✏️ Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Mobile - Cards */}
              <div className="md:hidden space-y-3">
                {stockRevendedor.map((stock) => (
                  <div 
                    key={stock.idStock} 
                    className={`rounded-lg p-4 border ${
                      stock.stockBajo ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <h3 className="font-bold text-gray-900 mb-2">{stock.nombreProducto}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Cantidad</p>
                        <p className="text-2xl font-bold text-gray-900">{stock.cantidadActual}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Mínimo</p>
                        <p className="text-lg text-gray-600">{stock.stockMinimo}</p>
                      </div>
                      <div>
                        {stock.stockBajo ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ⚠️ Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ OK
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditarStock(stock)}
                      className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      ✏️ Editar Stock
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Modal Agregar Stock */}
      <AgregarStockModal
        isOpen={showAgregarModal}
        onClose={handleCloseModal}
        onStockAgregado={handleAgregarStock}
        productos={productos}
        esRevendedor={tabActivo === 'revendedor'}
        idRevendedor={revendedorSeleccionado || undefined}
        stockEditar={stockEditar}
      />

      {/* Modal Transferir Stock */}
      <TransferirStockModal
        isOpen={showTransferirModal}
        onClose={() => setShowTransferirModal(false)}
        onStockTransferido={handleTransferir}
        productos={productos}
        revendedores={revendedores}
      />
    </div>
  );
};
