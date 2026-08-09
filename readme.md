# LeNCHoTeCH

**Todo lo que pase es mi culpa.**

[LeNCHoTeCH en GitHub Pages](https://darklencho.github.io/LeNCHoTeCH/)

LeNCHoTeCH es una tienda tecnológica simulada desarrollada como proyecto académico con HTML, CSS y JavaScript. El proyecto comenzó como un catálogo relacionado con temas estudiados en CompTIA A+ y evolucionó hasta convertirse en una demostración completa de una tienda web interactiva con autenticación, persistencia de datos, comparación de productos, carrito, favoritos, filtros avanzados y soporte bilingüe.

> **Importante:** LeNCHoTeCH es un proyecto educativo. No procesa pagos reales ni realiza envíos.

---

## Objetivo

El objetivo de LeNCHoTeCH es demostrar, dentro de un proyecto web académico, la integración de distintas funciones comunes en una tienda tecnológica moderna sin utilizar frameworks de interfaz.

El proyecto busca combinar una interfaz clara y adaptable con lógica escrita en JavaScript, manejo de datos locales, autenticación mediante Firebase y organización de productos tecnológicos relacionados con hardware, periféricos, almacenamiento, redes, impresión y mantenimiento.

---

## Versión actual

**Release 1.0**

La versión 1.0 representa la primera versión completa y estable del proyecto antes de comenzar la futura implementación del sistema **Mis compras**.

---

## Funcionalidades principales

### Catálogo de productos

- Catálogo generado dinámicamente desde JavaScript.
- 34 productos tecnológicos organizados por categorías y subcategorías.
- Imágenes locales para los productos y el logotipo.
- Manejo automático de imágenes faltantes mediante un placeholder generado por la interfaz.
- Vista rápida de cada producto con información, precio, disponibilidad y especificaciones.
- Traducción de nombres, descripciones, categorías, subcategorías y especificaciones.

### Búsqueda, filtros y ordenamiento

- Búsqueda de productos en tiempo real.
- Filtros por categoría.
- Filtros por subcategoría.
- Filtros por marca.
- Filtro de disponibilidad.
- Filtro por precio máximo.
- Filtro independiente de **Ofertas / Deals**, integrado también con los filtros activos.
- Chips de filtros activos que pueden eliminarse individualmente.
- Botón para restablecer todos los filtros.
- Ordenamiento por:
  - Destacados.
  - Precio de menor a mayor.
  - Precio de mayor a menor.
  - Nombre A-Z.
  - Nombre Z-A.
  - Calificación.

### Carrito

- Añadir y eliminar productos.
- Control de cantidad mediante botones `-` y `+` o escribiendo la cantidad directamente.
- Límites de cantidad según el stock disponible.
- Cálculo dinámico de cantidades y totales.
- Botones de carrito sincronizados entre las tarjetas y la vista rápida.
- Opción para vaciar el carrito.
- Checkout educativo/simulado.
- Aviso explícito de que no se procesa ningún pago real.

### Favoritos

- Añadir y eliminar productos de favoritos.
- Estado sincronizado entre tarjetas y vista rápida.
- Lista lateral de favoritos.
- Opción para vaciar favoritos cuando existen productos guardados.
- Posibilidad de añadir productos al carrito desde favoritos.

### Comparación de productos

- Comparación de hasta tres productos simultáneamente.
- Barra de comparación con los productos seleccionados.
- Los productos que no están seleccionados se deshabilitan al alcanzar el límite de tres.
- Tabla comparativa con:
  - Precio.
  - Categoría.
  - Subcategoría.
  - Disponibilidad.
  - Calificación.
  - Especificaciones técnicas.
- Posibilidad de retirar productos individualmente o limpiar la comparación.
- El filtro de comparación y sus textos se mantienen sincronizados con el idioma seleccionado.

---

## Sistema de usuarios

LeNCHoTeCH utiliza **Firebase Authentication** para manejar las cuentas.

El sistema permite:

- Crear una cuenta.
- Iniciar sesión.
- Cerrar sesión.
- Mostrar u ocultar contraseñas.
- Validar contraseña y confirmación de contraseña.
- Recuperar una contraseña mediante correo electrónico.
- Enviar un correo de verificación.
- Reenviar la verificación de correo.
- Mostrar si una cuenta está verificada o sin verificar.

Los perfiles de usuario se registran en **Cloud Firestore** con información utilizada por el proyecto, incluyendo nombre visible, correo, rol, estado de verificación, fecha de creación, último acceso y cantidad de inicios de sesión.

---

## Invitados y usuarios registrados

El proyecto mantiene separados los datos temporales de un invitado y los datos privados de una cuenta registrada.

### Invitado

Cuando no existe una sesión iniciada:

- El carrito se guarda en `localStorage`.
- Los favoritos se guardan en `localStorage`.
- La comparación se guarda en `localStorage`.
- El idioma y otras preferencias de interfaz pueden mantenerse en el navegador.

### Usuario registrado

Cuando existe una sesión iniciada:

- El carrito privado se carga y guarda en Firestore.
- Los favoritos privados se cargan y guardan en Firestore.
- Los datos quedan asociados al UID de Firebase del usuario.

Al cerrar sesión, la tienda vuelve al entorno local del navegador para carrito y favoritos.

---

## Panel de administración

Las cuentas con rol `admin` tienen acceso a un panel administrativo independiente.

El panel muestra:

- Total de usuarios registrados.
- Cantidad de correos verificados.
- Cantidad de cuentas sin verificar.
- Total acumulado de inicios de sesión registrados.
- Lista de usuarios.
- Nombre y correo del usuario.
- Rol de la cuenta.
- Estado de verificación.
- Último acceso.
- Cantidad de accesos.
- Botón para actualizar la información.

Las fechas se muestran utilizando el formato correspondiente al idioma activo.

---

## Idiomas

La interfaz está disponible completamente en:

- **Español**
- **English**

El sistema de traducción incluye tanto contenido estático como contenido generado dinámicamente, entre ellos:

- Navegación.
- Catálogo.
- Categorías y subcategorías.
- Productos y descripciones.
- Especificaciones.
- Filtros.
- Vista rápida.
- Carrito.
- Favoritos.
- Comparación.
- Autenticación.
- Panel de cuenta.
- Administración.
- Contacto.
- Footer.
- Mensajes, toasts, placeholders y textos de accesibilidad.
- Título y descripción de la página.

Los nombres de cada idioma se mantienen en su propio idioma: **Español** y **English**.

---

## Apariencia y diseño adaptable

- Tema claro.
- Tema oscuro.
- Diseño responsive para computadoras, tablets y móviles.
- Menú de categorías adaptable.
- Megamenú con desplazamiento cuando el contenido supera el espacio disponible.
- Drawers laterales para carrito y favoritos.
- Modales para autenticación, vista rápida, comparación, checkout y administración.
- Scrollbars personalizados para mejorar la visibilidad.
- Botón flotante para volver al inicio.
- Navegación mediante enlaces internos con desplazamiento suave.

---

## Accesibilidad y experiencia de usuario

El proyecto incorpora distintos detalles destinados a mejorar la interacción:

- Skip link para saltar al contenido principal.
- `aria-label` en controles e iconos relevantes.
- Tooltips mediante atributos `title` cuando corresponde.
- Estados deshabilitados para acciones no disponibles.
- Mensajes visuales mediante toasts.
- Validaciones de formularios.
- Fallbacks de imágenes.
- Sincronización de botones entre diferentes vistas del mismo producto.
- Estados vacíos para carrito, favoritos y comparación.

---

## Formulario de contacto

La sección de contacto incluye:

- Nombre.
- Correo electrónico.
- Asunto.
- Selección del tipo de consulta.
- Mensaje.

Actualmente el formulario es **simulado**: muestra el flujo visual de envío, limpia el formulario y presenta una confirmación, pero no envía el mensaje a un servicio externo ni genera una respuesta real.

---

## Firebase

El proyecto utiliza Firebase mediante el SDK oficial cargado desde CDN.

Servicios utilizados en la versión 1.0:

- **Firebase Authentication** — registro, inicio de sesión, verificación y recuperación de contraseña.
- **Cloud Firestore** — perfiles de usuario, carrito y favoritos de usuarios autenticados.
- **Firebase Analytics** — se inicializa cuando el navegador y el entorno lo soportan.

La interfaz principal continúa desarrollada sin frameworks de frontend.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- Web Storage / `localStorage`
- Firebase Authentication
- Cloud Firestore
- Firebase Analytics
- Git y GitHub
- GitHub Pages
- Visual Studio Code

---

## Estructura del proyecto

```text
LeNCHoTeCH/
│
├── css/
│   ├── animations.css
│   ├── responsive.css
│   └── style.css
│
├── images/
│   ├── logo/
│   │   └── logo.webp
│   └── products/
│       ├── cables/
│       ├── components/
│       ├── displays/
│       ├── maintenance/
│       ├── motherboards/
│       ├── printers/
│       ├── psu/
│       ├── ram/
│       └── storage/
│
├── js/
│   ├── auth.js
│   ├── cart.js
│   ├── compare.js
│   ├── favorites.js
│   ├── firebase-config.js
│   ├── products.js
│   ├── script.js
│   └── translations.js
│
├── index.html
└── readme.md
```

---

## Organización del JavaScript

El proyecto separa sus funciones principales en distintos módulos:

- `products.js` — catálogo y datos de productos.
- `script.js` — interfaz principal, navegación, catálogo, búsqueda, filtros, traducciones visibles y utilidades compartidas.
- `cart.js` — lógica del carrito y persistencia local/Firestore.
- `favorites.js` — lógica de favoritos y persistencia local/Firestore.
- `compare.js` — sistema de comparación de productos.
- `auth.js` — autenticación, cuenta de usuario y panel administrativo.
- `firebase-config.js` — inicialización de Firebase.
- `translations.js` — diccionarios y motor de internacionalización ES/EN.

---

## Relación con CompTIA A+

El catálogo utiliza categorías relacionadas con hardware estudiado durante el proyecto académico y con temas presentes en CompTIA A+, entre ellas:

- Displays.
- Cables y conectores.
- RAM.
- Almacenamiento.
- Componentes de PC.
- Fuentes de poder.
- Impresoras.
- Productos de mantenimiento.

El propósito no es sustituir material oficial de CompTIA, sino utilizar conceptos de hardware como base para una aplicación web práctica.

---

## Cómo ejecutar el proyecto localmente

1. Clonar o descargar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Iniciar un servidor local, por ejemplo mediante **Live Server**.
4. Abrir `index.html` desde el servidor local.

No es necesario instalar dependencias mediante `npm` para ejecutar la interfaz actual.

> Algunas funciones dependen de Firebase y requieren acceso a Internet para cargar el SDK y comunicarse con los servicios configurados.

---

## GitHub Pages

La versión pública puede consultarse en:

**https://darklencho.github.io/LeNCHoTeCH/**

---

## Limitaciones de la versión 1.0

- La tienda es una simulación educativa.
- No se procesan pagos reales.
- No se realizan envíos.
- El formulario de contacto no envía mensajes a un servicio externo.
- El checkout actual muestra únicamente el aviso de compra simulada.

---

## Próxima etapa

Después de la Release 1.0 está planificada una futura versión **1.1** centrada en el sistema **Mis compras**, incluyendo historial de compras simuladas para usuarios registrados y funciones relacionadas.

Estas funciones no forman parte de la versión 1.0 actual.

---

## Estado del proyecto

**LeNCHoTeCH 1.0 — listo para release.**

La versión 1.0 completa la primera etapa del proyecto: catálogo, sistema bilingüe, filtros, carrito, favoritos, comparación, Firebase Authentication, persistencia mediante Firestore, panel administrativo y diseño responsive.

---

## Autor

**David Serrano**

Proyecto desarrollado con fines educativos.
