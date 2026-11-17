# AI Do It — Frontend

Mobile frontend en React Native con Expo.

## Requisitos

- Node.js LTS 20.19.4 o superior (se recomienda instalar con [nvm](https://github.com/nvm-sh/nvm)).
- La app corre en un dispositivo físico o emulador Android/iOS.
- El backend debe estar corriendo en `http://<LAN-IP>:3000`.

## Instalación

```bash
cd frontend
npm install
```

## Levantar la app

```bash
# Modo desarrollo con recarga en caliente
npm run dev

# O lo equivalente:
npx expo start
```

Esto abre el Metro Bundler y muestra un código QR. Desde el dispositivo:

- **Dispositivo físico**: instalar **Expo Go** y escanear el QR. Ambos deben estar en la misma red Wi-Fi.
- **Emulador Android**: presionar `a` en la terminal.
- **Simulador iOS**: presionar `i` (solo en macOS).

## Configurar la URL del backend

Por defecto el frontend apunta a `http://localhost:3000` (útil para emuladores). Para probar en un dispositivo físico, editar `frontend/src/context/ApiConfigContext.js` y cambiar `baseUrl` por la IP LAN de la máquina donde corre el backend, por ejemplo `http://192.168.1.42:3000`.

## Estructura de carpetas

El código fuente vive en `frontend/src/` y sigue una arquitectura orientada a features:

- **`features/`** — una carpeta por capacidad de usuario. Contiene pantallas, hooks y sub-componentes propios de esa feature.
- **`shared/`** — primitivas del sistema de diseño (`Button`, `Text`, `Card`, etc.).
- **`components/`** — componentes reutilizables compuestos, usados por varias features.
- **`context/`** — proveedores de estado global compartido (configuración de API, rol demo).
- **`domain/`** — lógica de negocio pura, modelos de dominio ricos. Sin dependencias de React Native ni UI.
- **`services/`** — clientes HTTP y adaptadores externos.

Reglas de ubicación:

- Una pantalla nueva siempre va en `features/<nombre-feature>/`.
- Un componente que se usa en más de una feature va en `components/`.
- Un componente base de UI va en `shared/`.
- Estado compartido entre features va en `context/`.
- Reglas, validaciones y cálculos puros van en `domain/`, preferentemente como clases que encapsulen estado y comportamiento.

## Verificar que todo funciona

1. Iniciar el backend: `cd backend && npm start`.
2. Iniciar el frontend: `cd frontend && npm run dev`.
3. Abrir la app en Expo Go o emulador.
4. En la pantalla inicial deberías ver:
   - Un saludo confirmando que la app cargó.
   - El rol demo actual (`cliente` o `freelancer`).
   - El estado del backend (`ok` o un mensaje de error si no se pudo conectar).
