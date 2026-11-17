# Contract: Demo Role Context

The application supports two demo personas: `cliente` and `freelancer`. The active role is held in React Context so any screen or component can adapt its behavior without prop drilling.

## State Shape

```json
{
  "role": "cliente" | "freelancer"
}
```

## Transitions

- `cliente` ↔ `freelancer` at any time.
- Re-selecting the current role MUST be a no-op.

## Consumer Rules

- Role-aware components MUST read from `DemoRoleContext`.
- The role value MUST only be used for UI/demo decisions; authorization rules remain the backend's responsibility.
