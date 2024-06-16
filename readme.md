# static-gen-multilang

## Descripción

Este proyecto es una configuración de Webpack para crear Landings estáticas multilingües utilizando Handlebars para generar HTML, Sass para los estilos y JavaScript con Babel para la compatibilidad con navegadores. Incluye soporte para múltiples idiomas y está configurado para optimizar la salida en producción.

## Estructura del Proyecto

La estructura del proyecto es la siguiente:

```
static-gen-multilang/
├── dist/
│   ├── about/
│   │   └── index.html
│   ├── en/
│   │   ├── about/
│   │   │   └── index.html
│   │   └── index.html
│   ├── static/
│   │   ├── css/
│   │   │   ├── about.00c6145811f4c6ec5667.css
│   │   │   ├── about.00c6145811f4c6ec5667.css.map
│   │   │   ├── home.d9b41ba80c85b8f38841.css
│   │   │   ├── home.d9b41ba80c85b8f38841.css.map
│   │   ├── img/
│   │   │   └── bg.jpg
│   │   ├── js/
│   │   │   ├── about.62a3e8642b693eb3ea5d.bundle.js
│   │   │   ├── about.62a3e8642b693eb3ea5d.bundle.js.map
│   │   │   ├── home.d7afbe966c1c308c8d.bundle.js
│   │   │   ├── home.d7afbe966c1c308c8d.bundle.js.map
│   │   │   ├── runtime.f34b5953963e7b7e2f2.bundle.js
│   │   │   ├── runtime.f34b5953963e7b7e2f2.bundle.js.map
│   └── index.html
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── node/
│   │   └── Dockerfile
│   └── docker-compose.yml
├── node_modules/
├── public/
│   └── static/
│       └── img/
│           └── bg.jpg
├── src/
│   ├── config/
│   │   ├── constants.js
│   │   └── handlebars-helpers.js
│   ├── pages/
│   │   ├── about/
│   │   │   ├── locale/
│   │   │   │   ├── en.json
│   │   │   │   └── es.json
│   │   │   ├── index.hbs
│   │   │   ├── index.js
│   │   │   └── index.scss
│   │   ├── home/
│   │   │   ├── locale/
│   │   │   │   ├── en.json
│   │   │   │   └── es.json
│   │   │   ├── index.hbs
│   │   │   ├── index.js
│   │   │   └── index.scss
│   └── styles/
│       └── global.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── webpack.config.js
```

## Instalación

Para instalar y configurar el proyecto, sigue estos pasos:

1. Clona el repositorio:

```bash
git clone https://github.com/avicdro/static-gen-multilang.git
cd static-gen-multilang
```

2. Instala las dependencias:

```bash
npm install
```

## Scripts Disponibles

En el archivo `package.json`, tienes disponibles los siguientes scripts:

- `start`: Inicia el servidor de desarrollo.
- `build`: Construye el proyecto para producción.

Para ejecutar estos scripts, usa los siguientes comandos:

```bash
npm run start
npm run build
```

## Archivos de Configuración

- `src/config/constants.js`: Define las páginas, idioma inicial, y otros valores constantes.
- `src/config/handlebars-helpers.js`: Crea helpers para Handlebars, usados en la generación de HTML.

## Páginas y Configuración de Idiomas

El archivo `src/config/constants.js` contiene la configuración de las páginas y los idiomas soportados:

```javascript
module.exports = {
  pages: ["home", "about"],
  languages: ["en", "es"],
  defaultLanguage: "es",
  initialPage: "home",
};
```

- **pages**: Define las páginas disponibles en el proyecto, en este caso `home` y `about`.
- **languages**: Define los idiomas soportados, en este caso `en` (inglés) y `es` (español).
- **defaultLanguage**: El idioma predeterminado para el proyecto, en este caso `es`.
- **initialPage**: La página inicial que se carga cuando se accede al sitio, en este caso `home`.

Cada página definida en `pages` se generará en los idiomas especificados en `languages`. Por ejemplo, habrá una versión `en` y `es` para las páginas `home` y `about`, de tal forma que quedaran estas rutas definidas:

Con idioma por defecto  
https://dominio.com/ -> initialPage  
https://dominio.com/about/

Con ruta con idioma  
https://dominio.com/en/ -> initialPage  
https://dominio.com/en/about/  
https://dominio.com/es/ -> initialPage  
https://dominio.com/es/about/

## Docker

El proyecto incluye configuración para Docker y poder previsualizar el build:

- `docker/nginx/nginx.conf`: Configuración de Nginx.
- `docker/node/Dockerfile`: Dockerfile para la imagen de Node.
- `docker-compose.yml`: Configuración de Docker Compose.

## Autor

**avicdro**

## Licencia

MIT
