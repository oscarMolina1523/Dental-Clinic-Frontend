# Proyecto Frontend

Una aplicación frontend moderna construida con React, Vite y Tailwind CSS.

## Tabla de Contenidos

* [Características](#características)
* [Requisitos Previos](#requisitos-previos)
* [Instalación](#instalación)
* [Configuración](#configuración)
* [Uso y Scripts](#uso-y-scripts)
* [Estructura del Proyecto](#estructura-del-proyecto)
* [Despliegue](#despliegue)
* [Licencia](#licencia)

---

## Características

* **Interfaz de Usuario Interactiva**: Componentes modernos, limpios y reutilizables.
* **Diseño Adaptativo (Responsive)**: Totalmente optimizado para dispositivos móviles, tabletas y ordenadores de escritorio.
* **Desarrollo Rápido**: Construido sobre Vite para un reemplazo de módulos en caliente (HMR) ultrarrápido.
* **Estilos con Tailwind CSS**: Framework de CSS basado en clases de utilidad.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu entorno local:

* **Node.js**: Versión `v18.0.0` o superior
* **npm** (incluido con Node.js), **pnpm** o **yarn**

Para verificar la versión de Node.js instalada, ejecuta:

```bash
node -v
```

---

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/oscarMolina1523/Dental-Clinic-Frontend.git
   cd Dental-Clinic-Frontend
   ```

2. **Instalar las dependencias del proyecto:**

   Usando `npm`:
   ```bash
   npm install
   ```

   *O si usas `pnpm` / `yarn`:*
   ```bash
   pnpm install
   # o
   yarn install
   ```

---

## Configuración

1. **Variables de Entorno:**
   Copia el archivo de ejemplo de variables de entorno para crear tu configuración local `.env`:

   ```bash
   cp .env.example .env
   ```

2. Abre el archivo `.env` y configura las URLs de las API o las claves necesarias:

   ```env
   VITE_API_BASE_URL=https://api.ejemplo.com
   VITE_APP_TITLE=Mi Aplicación Frontend
   ```

> **Nota:** Todas las variables de entorno expuestas hacia Vite deben llevar el prefijo `VITE_`.

---

## Uso y Scripts (Puesta en marcha)

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia la aplicación en modo de desarrollo en `http://localhost:5173`. |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist`. |
| `npm run preview` | Permite previsualizar localmente la compilación de producción. |
| `npm run lint` | Ejecuta ESLint para verificar el formato y la calidad del código. |

### Iniciar el Servidor de Desarrollo

Para poner en marcha el entorno de desarrollo local:

```bash
npm run dev
```

Abre <http://localhost:5173> en tu navegador para ver la aplicación. La página se recargará automáticamente cada vez que realices y guardes cambios en los archivos.

---

## Estructura del Proyecto

```text
├── public/              # Archivos estáticos
├── src/
│   ├── assets/          # Imágenes, iconos y recursos multimedia globales
│   ├── components/      # Componentes reutilizables de UI
│   ├── pages/           # Vistas o páginas para el enrutamiento
│   ├── hooks/           # Hooks personalizados de React
│   ├── services/        # Lógica de integración y peticiones a APIs
│   ├── styles/          # Estilos globales y configuración de Tailwind
│   ├── App.jsx          # Componente principal de la aplicación
│   └── main.jsx         # Punto de entrada de la aplicación
├── .env.example         # Plantilla para las variables de entorno
├── index.html           # Documento HTML principal
├── package.json         # Metadatos del proyecto y dependencias
├── tailwind.config.js   # Configuración de Tailwind CSS
└── vite.config.js       # Configuración de Vite
```

---

## Despliegue

Para generar la compilación de producción optimizada:

```bash
npm run build
```

Esto generará la carpeta `dist/` lista para ser desplegada en plataformas de hosting estático como **Vercel**, **Netlify**, **GitHub Pages** o en un servidor web **Nginx**.

---

## Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE).