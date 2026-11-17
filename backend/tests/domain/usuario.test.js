import { Usuario } from '../../src/domain/Usuario.js';
import { RolUsuario } from '../../src/enums/RolUsuario.js';

describe('Usuario', () => {
  describe('constructor', () => {
    it('debería crear una instancia con nombre y apellido', () => {
      const usuario = new Usuario({ nombre: 'Juan', apellido: 'Pérez' });

      expect(usuario.nombre).toBe('Juan');
      expect(usuario.apellido).toBe('Pérez');
    });
  });

  describe('agregarGigAFavoritos', () => {
    it('debería agregar un gig a favoritos sin lanzar error', () => {
      const usuario = new Usuario({ nombre: 'Juan', apellido: 'Pérez' });
      const gig = { id: '1', nombre: 'Diseño web' };

      expect(() => usuario.agregarGigAFavoritos(gig)).not.toThrow();
    });

    it('debería lanzar error si el gig es null', () => {
      const usuario = new Usuario({ nombre: 'Juan', apellido: 'Pérez' });

      expect(() => usuario.agregarGigAFavoritos(null)).toThrow('Gig invalido');
    });
  });

  describe('agregarRolDeUsuario', () => {
    it('Se debe poder setear un rol al usuario', () => {
      const usuario = new Usuario({ nombre: 'Juan', apellido: 'Pérez' });
      usuario.setRole(RolUsuario.FREELANCE);
      expect(usuario.rol).toBe(RolUsuario.FREELANCE);
    });
  });
});
