import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '@shared/services';
import { DashboardStats } from '@shared/types';
import { formatCurrency } from '@shared/utils';

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

const ActionCard = ({ title, description, icon, color, bgColor, onClick }: ActionCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-left w-full group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`text-5xl sm:text-6xl ${color}`}>{icon}</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className={`w-6 h-6 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <h3 className={`text-xl sm:text-2xl font-bold ${color} mb-2`}>{title}</h3>
      <p className="text-gray-700 text-sm sm:text-base">{description}</p>
    </button>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

const StatCard = ({ label, value, icon, color }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600 mb-1">{label}</p>
          <p className="text-lg sm:text-xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Panel de Control
        </h1>
        <p className="text-gray-600">Gestiona tu joyería de forma eficiente</p>
      </div>

      {/* Acciones Principales */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">⚡</span>
          Acciones Rápidas
        </h2>
        
        {/* Layout Desktop - Original */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ActionCard
            title="Crear Pedido"
            description="Registra un nuevo pedido de cliente o revendedor"
            icon="➕"
            color="text-blue-600"
            bgColor="bg-blue-50 hover:bg-blue-100"
            onClick={() => navigate('/pedidos/nuevo')}
          />
          
          <ActionCard
            title="Ver Pedidos"
            description="Consulta y gestiona todos los pedidos con filtros por fecha"
            icon="📦"
            color="text-purple-600"
            bgColor="bg-purple-50 hover:bg-purple-100"
            onClick={() => navigate('/pedidos')}
          />
          
          <ActionCard
            title="Gestionar Stock"
            description="Administra el inventario de productos y stock de revendedores"
            icon="📊"
            color="text-green-600"
            bgColor="bg-green-50 hover:bg-green-100"
            onClick={() => navigate('/stock')}
          />
          
          <ActionCard
            title="Productos"
            description="Administra el catálogo de productos de la joyería"
            icon="💎"
            color="text-pink-600"
            bgColor="bg-pink-50 hover:bg-pink-100"
            onClick={() => navigate('/productos')}
          />
          
          <ActionCard
            title="Clientes"
            description="Gestiona la información de tus clientes"
            icon="👤"
            color="text-indigo-600"
            bgColor="bg-indigo-50 hover:bg-indigo-100"
            onClick={() => navigate('/clientes')}
          />
          
          <ActionCard
            title="Revendedores"
            description="Administra revendedores y sus comisiones"
            icon="🤝"
            color="text-orange-600"
            bgColor="bg-orange-50 hover:bg-orange-100"
            onClick={() => navigate('/revendedores')}
          />
        </div>

        {/* Layout Móvil - Crear Pedido destacado */}
        <div className="md:hidden space-y-4">
          {/* Crear Pedido - Destacado */}
          <ActionCard
            title="Crear Pedido"
            description="Registra un nuevo pedido"
            icon="➕"
            color="text-blue-600"
            bgColor="bg-blue-50 hover:bg-blue-100"
            onClick={() => navigate('/pedidos/nuevo')}
          />

          {/* Otras Acciones en Cuadrícula 2x3 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/pedidos')}
              className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 shadow hover:shadow-md transition-all text-left"
            >
              <div className="text-3xl text-purple-600 mb-2">📦</div>
              <h3 className="text-sm font-bold text-purple-600">Pedidos</h3>
            </button>
            
            <button
              onClick={() => navigate('/productos')}
              className="bg-pink-50 hover:bg-pink-100 rounded-lg p-4 shadow hover:shadow-md transition-all text-left"
            >
              <div className="text-3xl text-pink-600 mb-2">💎</div>
              <h3 className="text-sm font-bold text-pink-600">Productos</h3>
            </button>
            
            <button
              onClick={() => navigate('/stock')}
              className="bg-green-50 hover:bg-green-100 rounded-lg p-4 shadow hover:shadow-md transition-all text-left"
            >
              <div className="text-3xl text-green-600 mb-2">📊</div>
              <h3 className="text-sm font-bold text-green-600">Stock</h3>
            </button>
            
            <button
              onClick={() => navigate('/clientes')}
              className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-4 shadow hover:shadow-md transition-all text-left"
            >
              <div className="text-3xl text-indigo-600 mb-2">👤</div>
              <h3 className="text-sm font-bold text-indigo-600">Clientes</h3>
            </button>
            
            <button
              onClick={() => navigate('/revendedores')}
              className="bg-orange-50 hover:bg-orange-100 rounded-lg p-4 shadow hover:shadow-md transition-all text-left col-span-2"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl text-orange-600">🤝</div>
                <h3 className="text-sm font-bold text-orange-600">Revendedores</h3>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Estado del Día */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">📊</span>
          Estado del Día
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Venta Total del Día"
            value={formatCurrency(stats?.ventasDelDia || 0)}
            icon="💰"
            color="text-blue-500"
          />
          <StatCard
            label="Ganancia del Día"
            value={formatCurrency(stats?.gananciaDelDia || 0)}
            icon="📈"
            color="text-green-500"
          />
          <StatCard
            label="Pedidos Pendientes"
            value={stats?.pedidosPendientes || 0}
            icon="📋"
            color="text-yellow-500"
          />
        </div>
      </div>

      {/* Información Adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Estado del Negocio</h3>
            <p className="text-sm text-blue-700">
              Las estadísticas se actualizan en tiempo real. Los pedidos pendientes incluyen: PENDIENTE, EN_PROCESO y EN_CAMINO.
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Reportes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">📈</span>
          Análisis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <ActionCard
            title="Reportes"
            description="Visualiza reportes y estadísticas detalladas"
            icon="📊"
            color="text-teal-600"
            bgColor="bg-teal-50 hover:bg-teal-100"
            onClick={() => navigate('/reportes')}
          />
          
          <ActionCard
            title="Ventas Revendedor"
            description="Consulta ventas realizadas por revendedores"
            icon="💼"
            color="text-cyan-600"
            bgColor="bg-cyan-50 hover:bg-cyan-100"
            onClick={() => navigate('/ventas-revendedor')}
          />
        </div>
      </div>
    </div>
  );
};
