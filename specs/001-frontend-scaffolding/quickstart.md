# Quickstart: Frontend Scaffolding and Initial Configuration

This guide validates the frontend foundation end-to-end without writing feature code.

## Prerequisites

- Node.js 18+ installed.
- A mobile device or emulator on the same local network as the development machine.
- The backend running on `http://<lan-ip>:3000` with the `/health` endpoint returning `{ "status": "ok" }`.

## Setup

1. Open a terminal in the repository root.
2. Change into the frontend workspace:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Start the Development Server

1. Start the Expo development server:
   ```bash
   npx expo start --tunnel
   ```
   Use `--lan` instead of `--tunnel` if both devices are on the same network and you prefer direct LAN access.
2. Scan the QR code with the Expo Go app on your mobile device, or press `a`/`i` to open an Android/iOS emulator.

## Validate the Scaffolding

1. **Project runs**: confirm the default landing screen appears.
2. **Folder structure**: open `frontend/src/` and confirm the five folders exist:
   - `features/`
   - `shared/`
   - `components/`
   - `context/`
   - `domain/`
3. **Backend connectivity**: the landing screen should show the result of a `GET /health` request to the configured backend URL.
4. **Role toggle**: use the role selector on the landing screen to switch between `cliente` and `freelancer`; confirm a role-aware badge updates immediately.

## Expected Outcomes

- The application launches without Metro bundler errors.
- The landing screen displays a greeting, the current demo role, and the backend health status.
- All source files are placed inside one of the five `frontend/src/` folders.
- A new teammate can repeat these steps in under 10 minutes.
