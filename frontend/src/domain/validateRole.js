import { DemoRole } from './DemoRole.js';

export function validateRole(role) {
  if (!DemoRole.isValid(role)) {
    throw new Error(`validateRole: "${role}" no es un rol válido`);
  }
  return new DemoRole(role);
}
