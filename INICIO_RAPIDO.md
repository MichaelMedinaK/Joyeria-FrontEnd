# Inicio Rápido - Joyeria Nicki Frontend

## 🚀 Estado del Proyecto

✅ **Proyecto configurado y funcionando**

El servidor de desarrollo está corriendo en: `http://localhost:3000`

## 📋 Credenciales de Acceso (Demo)

- **Email**: Cualquier email válido (ej: admin@joyeria.com)
- **Contraseña**: Cualquier texto

La autenticación es simulada, por lo que puedes usar cualquier combinación de email y contraseña para acceder.

## 🗺️ Navegación

Una vez que inicies sesión, tendrás acceso a:

1. **Dashboard** - Vista general con estadísticas
2. **Productos** - Gestión de productos
3. **Stock** - Control de inventario
4. **Pedidos** - Sistema de pedidos
5. **Clientes** - Base de datos de clientes
6. **Revendedores** - Gestión de revendedores
7. **Ventas Revendedor** - Registro de ventas
8. **Reportes** - Análisis y reportes

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor de desarrollo
cd joyeria-front
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint
```

## 📁 Estructura Creada

```
joyeria-front/
├── src/
│   ├── app/                    # Configuración de la app
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── shared/                 # Código compartido
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── layouts/           # Layouts
│   │   │   └── MainLayout.tsx
│   │   ├── services/          # Servicios/API mock
│   │   │   ├── auth.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── producto.service.ts
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Utilidades
│   └── features/              # Módulos por funcionalidad
│       ├── auth/
│       ├── dashboard/
│       ├── productos/
│       ├── stock/
│       ├── pedidos/
│       ├── clientes/
│       ├── revendedores/
│       ├── ventasRevendedor/
│       └── reportes/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## ✨ Características Implementadas

### ✅ Completado

- [x] Configuración completa del proyecto
- [x] Sistema de rutas con React Router
- [x] Layout principal con sidebar y header
- [x] Página de login funcional
- [x] Dashboard con tarjetas de estadísticas
- [x] Páginas placeholder para todos los módulos
- [x] Servicios mock para datos de prueba
- [x] Tipos TypeScript completos
- [x] Estilos con Tailwind CSS
- [x] Navegación entre módulos

### 🚧 Pendiente para las siguientes fases

- [ ] Formularios completos para CRUD
- [ ] Sistema de carrito para pedidos
- [ ] Asignación de stock a revendedores
- [ ] Cálculo de delivery por kilómetros
- [ ] Integración con API backend real
- [ ] Manejo de errores completo
- [ ] Validaciones de formularios
- [ ] Confirmaciones de acciones

## 🎨 Diseño y UX

- **Colores**: Esquema en rojo/primary (personalizable en tailwind.config.js)
- **Iconos**: Emojis Unicode (fácil de reemplazar por librerías como Heroicons)
- **Responsive**: Layout adaptable a móviles y tablets
- **Componentes**: Clases reutilizables en Tailwind

## 🔄 Próximos Pasos Sugeridos

1. **Implementar CRUD de Productos**
   - Formulario de creación
   - Lista con edición y eliminación
   - Validaciones

2. **Sistema de Pedidos con Carrito**
   - Selección de cliente
   - Agregar productos al carrito
   - Cálculo de delivery
   - Resumen y confirmación

3. **Gestión de Stock**
   - Ver stock actual
   - Asignar stock a revendedores
   - Alertas de stock bajo

4. **Integración con Backend**
   - Configurar servicios API reales
   - Implementar interceptores
   - Manejo de errores HTTP

## 📝 Notas Importantes

- **Node Version**: El proyecto está configurado para Node 16+ (usa Vite 4.x)
- **Autenticación**: Actualmente es simulada con localStorage
- **Datos**: Todos los datos son mock y se pierden al recargar
- **API**: No está conectado al backend todavía

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error de TypeScript
Verifica que los aliases estén configurados en `tsconfig.json` y `vite.config.ts`

### Estilos no se aplican
Asegúrate de que `src/index.css` esté importado en `main.tsx`

## 📧 Contacto

Para dudas o mejoras, contacta al equipo de desarrollo.

---

**¡Listo para desarrollar!** 🚀
