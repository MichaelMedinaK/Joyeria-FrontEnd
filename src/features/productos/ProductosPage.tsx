import { useState, useEffect } from 'react';
import { productoService } from '@shared/services';
import { Producto } from '@shared/types';
import { CrearProductoModal } from './CrearProductoModal';
import { EditarProductoModal } from './EditarProductoModal';

export const ProductosPage = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productoService.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductoCreado = () => {
    loadProductos();
  };

  const handleProductoActualizado = () => {
    loadProductos();
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setShowEditarModal(true);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Productos</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Gestión de productos de joyería</p>
      </div>

      {/* Botón Nuevo Producto - Destacado */}
      <div className="mb-6">
        <button 
          onClick={() => setShowCrearModal(true)}
          className="w-full sm:w-auto btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Card Principal */}
      <div className="card">
        {/* Buscador */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar producto:</label>
          <div className="relative">
            <input
              type="search"
              placeholder="Nombre, descripción, código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Lista de Productos */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg">Cargando productos...</div>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="text-5xl sm:text-6xl mb-4">💎</div>
            <p className="text-base sm:text-lg font-semibold">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
            </p>
            <p className="text-xs sm:text-sm mt-2">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando productos al catálogo'}
            </p>
          </div>
        ) : (
          <>
            {/* Tabla desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Compra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio Venta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProductos.map((producto) => (
                    <tr key={producto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                        <div className="text-xs text-gray-500">{producto.descripcion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${producto.precio_compra.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">
                        ${producto.precio_venta.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          producto.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditarProducto(producto)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          Editar
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="md:hidden space-y-4">
              {filteredProductos.map((producto) => (
                <div key={producto.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900">{producto.nombre}</h3>
                      <p className="text-xs text-gray-500 mt-1">{producto.descripcion}</p>
                    </div>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      producto.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Precio Compra</p>
                      <p className="text-sm font-medium text-gray-900">${producto.precio_compra.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Precio Venta</p>
                      <p className="text-sm font-semibold text-primary-600">${producto.precio_venta.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button 
                      onClick={() => handleEditarProducto(producto)}
                      className="flex-1 btn-secondary text-sm py-2"
                    >
                      Editar
                    </button>
                    <button className="flex-1 btn-secondary text-sm py-2 text-red-600 hover:bg-red-50">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Contador */}
            <div className="mt-4 text-sm text-gray-600 text-center">
              Mostrando {filteredProductos.length} de {productos.length} productos
            </div>
          </>
        )}
      </div>

      {/* Modal Crear Producto */}
      <CrearProductoModal
        isOpen={showCrearModal}
        onClose={() => setShowCrearModal(false)}
        onProductoCreado={handleProductoCreado}
      />

      {/* Modal Editar Producto */}
      {productoSeleccionado && (
        <EditarProductoModal
          isOpen={showEditarModal}
          onClose={() => {
            setShowEditarModal(false);
            setProductoSeleccionado(null);
          }}
          onProductoActualizado={handleProductoActualizado}
          producto={productoSeleccionado}
        />
      )}
    </div>
  );
};
