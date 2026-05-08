import { useNavigate } from 'react-router-dom';
import { authService } from '@shared/services';

export const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-primary-100 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Botón Home */}
        <button
          onClick={handleHome}
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
          title="Ir al inicio"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 group-hover:text-primary-700" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
            />
          </svg>
        </button>

        {/* Logo y Info Usuario */}
        <img 
          src="/logo.png" 
          alt="Joyeria Nicki" 
          className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-800 tracking-wide truncate">
            {user?.nombre || 'Usuario'}
          </h2>
          <p className="text-xs sm:text-sm text-accent-600 font-medium truncate">
            {user?.rol || 'Rol no definido'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Info usuario en desktop */}
        <div className="text-right mr-2 sm:mr-4 hidden lg:block">
          <p className="text-sm font-medium text-gray-700">{user?.email}</p>
        </div>
        
        {/* Botón Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
        >
          <span className="hidden sm:inline">Cerrar Sesión</span>
          <span className="sm:hidden">Salir</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
};
