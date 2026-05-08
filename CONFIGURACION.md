# 🏪 Joyería Joy - Frontend

Panel de administración para gestión de joyería con sistema de pedidos, stock y revendedores.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu backend:
```env
VITE_API_URL=http://localhost:8080/api
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Configuración de la app y rutas
├── features/              # Módulos por funcionalidad
│   ├── auth/             # Autenticación y login
│   ├── dashboard/        # Panel principal
│   ├── pedidos/          # Gestión de pedidos
│   ├── productos/        # Catálogo de productos
│   ├── clientes/         # Gestión de clientes
│   ├── revendedores/     # Administración de revendedores
│   └── stock/            # Control de inventario
└── shared/               # Recursos compartidos
    ├── components/       # Componentes reutilizables
    ├── layouts/          # Layouts de página
    ├── services/         # Servicios API
    ├── types/            # TypeScript types
    └── utils/            # Funciones de utilidad
```

---

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

---

## 🌐 Configuración de Deployment

### Para producción:

1. Actualiza el archivo `.env` con la URL de tu backend en producción:
```env
VITE_API_URL=https://tu-dominio.com/api
```

2. Genera el build:
```bash
npm run build
```

3. Los archivos estáticos estarán en la carpeta `dist/`

---

## 🎨 Características

- ✅ **Dashboard interactivo** con estado del día
- ✅ **Gestión de pedidos** con filtros por fecha
- ✅ **Control de stock** para productos y revendedores
- ✅ **Sistema de autenticación** con JWT
- ✅ **Diseño responsive** con Tailwind CSS
- ✅ **TypeScript** para type safety

---

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:
- Tokens válidos por 24 horas
- Renovación automática al actualizar datos de usuario
- Almacenamiento seguro en localStorage

---

## 🛠️ Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **Fetch API** para llamadas HTTP

---

## 📝 Notas

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- Los tokens JWT expiran después de 24 horas
- La configuración CORS debe permitir el origen del frontend

