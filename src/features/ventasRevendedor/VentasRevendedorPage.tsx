export const VentasRevendedorPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Ventas de Revendedores</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Registro de ventas realizadas por revendedores</p>
      </div>

      {/* Botón Registrar Venta - Destacado */}
      <div className="mb-6">
        <button className="w-full sm:w-auto btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Registrar Venta</span>
        </button>
      </div>

      {/* Card Principal */}
      <div className="card">
        {/* Filtros */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por revendedor:</label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
            <option value="">Todos los revendedores</option>
            <option value="1">Revendedor 1</option>
            <option value="2">Revendedor 2</option>
          </select>
        </div>

        {/* Filtro por Fecha */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtrar por fecha:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Desde:</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Hasta:</label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="sm:col-span-2 flex items-end gap-2">
              <button className="flex-1 btn-primary text-sm py-2">
                🔍 Buscar
              </button>
              <button className="flex-1 btn-secondary text-sm py-2">
                🔄 Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Ventas (placeholder) */}
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <div className="text-5xl sm:text-6xl mb-4">💰</div>
          <p className="text-base sm:text-lg font-semibold">No hay ventas registradas</p>
          <p className="text-xs sm:text-sm mt-2">Registra la primera venta de un revendedor</p>
          <p className="text-xs mt-4 text-gray-400 max-w-md mx-auto px-4">
            Registra ventas y calcula ganancias. El stock se descuenta automáticamente
          </p>
        </div>
      </div>
    </div>
  );
};
