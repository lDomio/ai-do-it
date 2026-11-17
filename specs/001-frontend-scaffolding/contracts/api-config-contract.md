# Contract: API Configuration

The front-end reads the backend base URL from a single source of truth. Any module that performs HTTP requests MUST consume this configuration through the shared `ApiConfigContext`.

## Configuration Shape

```json
{
  "baseUrl": "http://<lan-ip>:3000",
  "timeoutMs": 5000
}
```

## Rules

- `baseUrl` MUST be read from `ApiConfigContext`; screens and services MUST NOT hard-code URLs.
- The default value SHOULD use `http://localhost:3000` for emulator convenience, but MUST be overrideable so a physical device can point to the LAN IP.
- If `baseUrl` is empty or malformed, the context provider MUST log a clear error and the application MUST show a fallback message.
