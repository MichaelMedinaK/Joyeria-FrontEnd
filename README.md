# Joyeria Nicki - Frontend

Frontend desarrollado en React + TypeScript para el sistema de gestión de Joyeria Nicki.

## Stack Tecnológico

- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Fetch API** - Comunicación con backend

## Estructura del Proyecto

```
src/
├── app/                    # Configuración de la aplicación
│   ├── App.tsx            # Componente principal
│   └── routes.tsx         # Definición de rutas
├── shared/                # Recursos compartidos
│   ├── components/        # Componentes reutilizables
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── layouts/          # Layouts de la app
│   │   └── MainLayout.tsx
│   ├── services/         # Servicios/API
│   │   ├── auth.service.ts
│   │   ├── dashboard.service.ts
│   │   └── producto.service.ts
│   ├── types/            # Tipos TypeScript
│   │   ├── auth.types.ts
│   │   ├── cliente.types.ts
│   │   ├── dashboard.types.ts
│   │   ├── pedido.types.ts
│   │   ├── producto.types.ts
│   │   ├── revendedor.types.ts
│   │   ├── stock.types.ts
│   │   └── venta.types.ts
│   └── utils/            # Utilidades
│       └── format.ts
└── features/             # Módulos por funcionalidad
    ├── auth/
    │   └── LoginPage.tsx
    ├── dashboard/
    │   └── DashboardPage.tsx
    ├── productos/
    │   └── ProductosPage.tsx
    ├── stock/
    │   └── StockPage.tsx
    ├── pedidos/
    │   └── PedidosPage.tsx
    ├── clientes/
    │   └── ClientesPage.tsx
    ├── revendedores/
    │   └── RevendedoresPage.tsx
    ├── ventasRevendedor/
    │   └── VentasRevendedorPage.tsx
    └── reportes/
        └── ReportesPage.tsx
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```

## Características Implementadas

### ✅ Fase 1 - Estructura Base

- [x] Configuración del proyecto (Vite, TypeScript, Tailwind)
- [x] Sistema de rutas con React Router
- [x] Layout principal con Sidebar y Header
- [x] Login con autenticación simulada
- [x] Dashboard con estadísticas mock
- [x] Páginas placeholder para todos los módulos

### 🚧 Próximas Fases

- [ ] Módulo de Productos (CRUD completo)
- [ ] Módulo de Stock
- [ ] Módulo de Pedidos con carrito
- [ ] Módulo de Clientes (CRUD)
- [ ] Módulo de Revendedores
- [ ] Módulo de Ventas de Revendedores
- [ ] Módulo de Reportes
- [ ] Integración con API backend

## Funcionalidades por Módulo

### 🔐 Autenticación
- Login con email y contraseña
- Token guardado en localStorage
- Redirección automática

### 📊 Dashboard
- Ventas del día
- Ganancia del día
- Pedidos pendientes
- Productos con bajo stock
- Stock en revendedores
- Actividad reciente

### 💎 Productos
- Listado de productos
- Crear producto
- Editar producto
- Campos: nombre, descripción, precio_compra, precio_venta, activo

### 📦 Stock
- Ver stock del dueño
- Ver stock por revendedor
- Información: producto, cantidad, stock mínimo, revendedor

### 🛒 Pedidos
- Crear pedido tipo carrito
- Seleccionar cliente y productos
- Cálculo automático de delivery según kilómetros
- Regla: ≤6km = $6.000, >6km = km * $1.000

### 👥 Clientes
- CRUD de clientes
- Campos: nombre, teléfono, email, documento

### 🤝 Revendedores
- CRUD de revendedores
- Asignar stock a revendedor
- Ver stock actual

### 💰 Ventas de Revendedores
- Registrar ventas
- Seleccionar productos del stock del revendedor
- Calcular ganancia
- Descontar stock

### 📈 Reportes
- Reportes de ventas
- Reportes de ganancias
- Reportes de stock
- Reportes de revendedores

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run preview` - Previsualiza el build
- `npm run lint` - Ejecuta el linter

## Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8080/api
```

## Notas de Desarrollo

- Los servicios actualmente usan datos mock
- La autenticación es simulada (localStorage)
- Los alias de importación están configurados en `tsconfig.json` y `vite.config.ts`
- El proyecto usa Tailwind CSS con clases personalizadas

## Autores

Sistema desarrollado para Joyeria Nicki.

## Licencia

Privado
# Joyeria-FrontEnd
