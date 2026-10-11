# FacturaWeb (angular 21)

frontend del sistema de facturacion que consume el api .net core.

## stack
- angular 21, componentes standalone
- signals + reactive forms
- routing con guard de autenticacion
- token guardado en estado global (signal + localStorage) mediante `SessionState`
- url del api inyectada con `InjectionToken` (`API_URL`)
- css puro, sin frameworks (paleta clara: #2563eb, #1e293b, #f8fafc, #dc2626)

## estructura (n-layer)
- `core/`: modelos, servicios, guards, interceptors, state, tokens
- `features/`: login, layout (menu), invoices, reports, maintenance
- `shared`: estilos globales en `src/styles.css`

## flujo
1. login -> guarda token y nombre en `SessionState`
2. guard `authGuard` redirige a `/login` si no hay sesion
3. interceptor agrega `Authorization: Bearer` y en 401 intenta refresh con la cookie
4. ingreso: lista de facturas -> boton "nueva factura" (crea) o "ver" (detalle, anular si existe)
5. reportes: lista con valor y estado + totales
6. mantenimientos: catalogos de clientes y productos
7. salida: cierra sesion

## configurar api
cambiar la url en `environment.ts` si el api no corre.

## ejecutar
```bash
npm install
npm start
```
abrir http://localhost:4200

## usuario de prueba
- usuario: `admin`
- clave: `admin123`
