import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@shared/layouts';
import { LoginPage } from '@features/auth';
import { DashboardPage } from '@features/dashboard';
import { ProductosPage } from '@features/productos';
import { StockPage } from '@features/stock';
import { PedidosPage, CrearPedidoPage } from '@features/pedidos';
import { ClientesPage } from '@features/clientes';
import { RevendedoresPage } from '@features/revendedores';
import { VentasRevendedorPage } from '@features/ventasRevendedor';
import { ReportesPage } from '@features/reportes';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'productos',
        element: <ProductosPage />
      },
      {
        path: 'stock',
        element: <StockPage />
      },
      {
        path: 'pedidos',
        element: <PedidosPage />
      },
      {
        path: 'pedidos/nuevo',
        element: <CrearPedidoPage />
      },
      {
        path: 'clientes',
        element: <ClientesPage />
      },
      {
        path: 'revendedores',
        element: <RevendedoresPage />
      },
      {
        path: 'ventas-revendedor',
        element: <VentasRevendedorPage />
      },
      {
        path: 'reportes',
        element: <ReportesPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
]);
