const VALID_ROLES = Object.freeze(['cliente', 'freelancer']);

export class DemoRole {
  constructor(role = 'cliente') {
    if (!DemoRole.isValid(role)) {
      throw new Error(`DemoRole: role must be one of ${VALID_ROLES.join(', ')}`);
    }
    this.role = role;
  }

  static isValid(role) {
    return VALID_ROLES.includes(role);
  }

  static validRoles() {
    return [...VALID_ROLES];
  }

  is(role) {
    return this.role === role;
  }

  toggle() {
    return new DemoRole(this.role === 'cliente' ? 'freelancer' : 'cliente');
  }
}
