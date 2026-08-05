# App de Gastos Familiares

Proyecto educativo — Técnico Medio en Sistemas Informáticos

## Objetivo del proyecto

Aprender a construir y desplegar una aplicación web real (no local) conectando:

- **Frontend**: HTML, CSS y JavaScript.
- **Backend / Base de datos**: Supabase (Postgres en la nube + almacenamiento de archivos).
- **Control de versiones**: GitHub.
- **Despliegue**: Vercel.

Esta app permite registrar los gastos de una familia, ver un dashboard con
estadísticas y subir una foto familiar. El sistema está diseñado para
**escalar más adelante** con login y roles (papá, mamá, hijo), aunque en
esta primera versión no los incluye.

## Herramientas que debes manejar

- Navegador web (Chrome recomendado).
- Cuenta de correo (para crear cuenta en Supabase y GitHub).
- [Visual Studio Code](https://code.visualstudio.com/).
- Cuenta en [Supabase](https://supabase.com).
- Cuenta en [GitHub](https://github.com).
- Cuenta en [Vercel](https://vercel.com).
- Conocimientos básicos de HTML, CSS y JavaScript.

## Requisitos previos

1. Tener las 4 cuentas creadas (Supabase, GitHub, Vercel — Vercel se puede
   crear con la misma cuenta de GitHub).
2. Tener VS Code instalado.
3. Tener este proyecto descomprimido en tu computadora.

## Estructura del proyecto

```
gastos-familiares/
├── index.html          -> Estructura de la página
├── css/
│   └── style.css        -> Todo el diseño visual
├── js/
│   ├── supabaseClient.js -> ÚNICO archivo que debes editar (tus claves)
│   └── app.js             -> Lógica de la app (no es necesario editarlo)
├── sql/
│   └── schema.sql         -> Script para crear las tablas en Supabase
└── README.md
```

## Flujo de trabajo (paso a paso)

### 1. Crear tu proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) e inicia sesión.
2. Clic en **New project**.
3. Ponle un nombre (ej: `gastos-familiares-tunombre`) y una contraseña de
   base de datos (guárdala, la puedes necesitar después).
4. Espera a que el proyecto termine de crearse (1-2 minutos).

### 2. Crear las tablas

1. En el menú lateral, entra a **SQL Editor**.
2. Clic en **New query**.
3. Abre el archivo `sql/schema.sql` de este proyecto, copia todo su
   contenido y pégalo en el editor.
4. Clic en **Run**. Deberías ver las tablas `familia`, `perfiles` y
   `gastos` creadas en **Table Editor**.

### 3. Crear el bucket de almacenamiento (para la foto familiar)

1. En el menú lateral, entra a **Storage**.
2. Clic en **New bucket**.
3. Nombre exacto: `fotos-familia`.
4. Activa la opción **Public bucket**.
5. Clic en **Create bucket**.

### 4. Conectar tu proyecto con tus claves

1. En Supabase, ve a **Project Settings > API**.
2. Copia el valor de **Project URL**.
3. Copia el valor de **anon public key**.
4. Abre el proyecto en VS Code.
5. Abre el archivo `js/supabaseClient.js`.
6. Reemplaza `PEGA_AQUI_TU_PROJECT_URL` y `PEGA_AQUI_TU_ANON_KEY` con tus
   valores copiados.
7. Guarda el archivo.

> La `anon key` **no es secreta**, puede ir en el frontend sin problema.
> Lo que realmente protege los datos son las políticas de seguridad (RLS)
> configuradas dentro de Supabase, no el hecho de ocultar esta clave.

### 5. Probar la app en tu computadora

1. En VS Code, instala la extensión **Live Server**.
2. Clic derecho sobre `index.html` > **Open with Live Server**.
3. Prueba registrar un gasto y subir una foto familiar.

### 6. Subir el proyecto a GitHub

1. Entra a [github.com](https://github.com) e inicia sesión.
2. Clic en **New repository**.
3. Ponle un nombre (ej: `gastos-familiares`) y créalo vacío (sin README).
4. Dentro del repositorio, clic en **Add file > Upload files**.
5. Arrastra **todos los archivos y carpetas** del proyecto a la ventana.
6. Escribe un mensaje de commit (ej: "Primera versión") y clic en
   **Commit changes**.

### 7. Desplegar en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta
   de GitHub.
2. Clic en **Add New > Project**.
3. Selecciona el repositorio que acabas de subir.
4. No necesitas cambiar ninguna configuración (es un sitio estático).
5. Clic en **Deploy**.
6. En unos segundos tendrás un link público, por ejemplo:
   `https://gastos-familiares-tunombre.vercel.app`

Cada vez que subas cambios nuevos a GitHub, Vercel actualizará la app
automáticamente.

## Próximos pasos (fase de escalabilidad)

Este proyecto está preparado para crecer sin romperse:

- La tabla `gastos` ya tiene la columna `usuario_id`, lista para cuando
  se active login con Supabase Auth.
- La tabla `perfiles` ya existe, lista para asignar roles
  (`admin`, `padre`, `madre`, `hijo`).
- Las políticas de seguridad (RLS) están comentadas dentro de
  `sql/schema.sql`, listas para activarse en la siguiente fase.

Esta fase se desarrollará en el proyecto grupal de título.
