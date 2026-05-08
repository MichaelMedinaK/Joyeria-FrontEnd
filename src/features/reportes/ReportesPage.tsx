export const ReportesPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Reportes</h1>
        <p className="text-sm sm:text-base text-accent-600 font-medium">Análisis y reportes del sistema</p>
      </div>

      {/* Grid de Reportes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <button className="card hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-200 hover:bg-primary-50 text-left">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">📊</span>
              <span>Reporte de Ventas</span>
            </h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Análisis de ventas por período, productos y clientes</p>
        </button>

        <button className="card hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-200 hover:bg-green-50 text-left">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">💰</span>
              <span>Reporte de Ganancias</span>
            </h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Ganancias por producto, revendedor y período</p>
        </button>

        <button className="card hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-200 hover:bg-yellow-50 text-left">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">📦</span>
              <span>Reporte de Stock</span>
            </h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Estado actual del inventario y movimientos</p>
        </button>

        <button className="card hover:shadow-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-200 hover:bg-purple-50 text-left">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🤝</span>
              <span>Reporte de Revendedores</span>
            </h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">Desempeño y comisiones de revendedores</p>
        </button>
      </div>

      {/* Información adicional */}
      <div className="card bg-gradient-to-br from-blue-50 to-primary-50">
        <div className="text-center py-8 sm:py-10">
          <div className="text-5xl sm:text-6xl mb-4">📈</div>
          <p className="text-base sm:text-lg font-semibold text-gray-900">Módulo de reportes completo</p>
          <p className="text-xs sm:text-sm mt-2 text-gray-600 max-w-2xl mx-auto px-4">
            Visualiza estadísticas, gráficos y análisis detallados del negocio. Exporta reportes en PDF o Excel.
          </p>
        </div>
      </div>
    </div>
  );
};
