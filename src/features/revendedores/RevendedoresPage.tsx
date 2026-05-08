export const RevendedoresPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Revendedores</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Gestión de revendedores y asignación de stock</p>
      </div>

      {/* Botón Nuevo Revendedor - Destacado */}
      <div className="mb-6">
        <button className="w-full sm:w-auto btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Registrar Revendedor</span>
        </button>
      </div>

      {/* Card Principal */}
      <div className="card">
        {/* Buscador */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar revendedor:</label>
          <div className="relative">
            <input
              type="search"
              placeholder="Nombre, teléfono, código..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Lista de Revendedores (placeholder) */}
        <div className="text-center py-8 sm:py-12 text-gray-500">
          <div className="text-5xl sm:text-6xl mb-4">🤝</div>
          <p className="text-base sm:text-lg font-semibold">No hay revendedores registrados</p>
          <p className="text-xs sm:text-sm mt-2">Agrega tu primer revendedor para comenzar</p>
          <p className="text-xs mt-4 text-gray-400 max-w-md mx-auto px-4">
            Gestiona revendedores, asigna stock y controla comisiones
          </p>
        </div>
      </div>
    </div>
  );
};
