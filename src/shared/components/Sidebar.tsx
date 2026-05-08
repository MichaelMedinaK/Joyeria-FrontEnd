import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/productos', label: 'Productos', icon: '💎' },
  { path: '/stock', label: 'Stock', icon: '📦' },
  { path: '/pedidos', label: 'Pedidos', icon: '🛒' },
  { path: '/clientes', label: 'Clientes', icon: '👥' },
  { path: '/revendedores', label: 'Revendedores', icon: '🤝' },
  { path: '/ventas-revendedor', label: 'Ventas Revendedor', icon: '💰' },
  { path: '/reportes', label: 'Reportes', icon: '📈' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-sm border-r border-primary-100 flex flex-col shadow-sm hidden lg:flex">
      <div className="p-4 sm:p-6 border-b border-primary-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/logo.png" 
            alt="Joyeria Nicki" 
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="text-4xl hidden">💎</span>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-500 tracking-wide">
              Joyeria Nicki
            </h1>
            <p className="text-xs text-accent-600 font-medium">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-100 text-primary-700 font-medium shadow-sm' 
                      : 'text-gray-700 hover:bg-primary-50 hover:shadow-sm'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary-100 text-center text-xs text-accent-600">
        <p className="font-medium">Joyeria Nicki</p>
        <p className="text-gray-400 mt-1">v0.0.1 • 2026</p>
      </div>
    </aside>
  );
};
