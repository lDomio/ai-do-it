import { Mensaje, MessageStatus } from '../../src/domain/Mensaje.js';

describe('Mensaje', () => {
  describe('constructor', () => {
    it('debería crear una instancia con los datos del mensaje', () => {
      const datos = {
        pedidoId: 'pedido-1',
        senderId: 'usuario-1',
        senderType: 'CLIENTE',
        content: 'Hola',
      };
      const mensaje = new Mensaje(datos);

      expect(mensaje.pedidoId).toBe(datos.pedidoId);
      expect(mensaje.senderId).toBe(datos.senderId);
      expect(mensaje.senderType).toBe(datos.senderType);
      expect(mensaje.content).toBe(datos.content);
      expect(mensaje.status).toBe(MessageStatus.ENVIADO);
      expect(mensaje.enviado).toBe(true);
    });
  });

  describe('setEnviado', () => {
    it('debería setear enviado con un booleano válido', () => {
      const mensaje = new Mensaje({
        pedidoId: 'pedido-1',
        senderId: 'usuario-1',
        senderType: 'CLIENTE',
        content: 'Hola',
      });

      mensaje.setEnviado = false;
      expect(mensaje.enviado).toBe(false);

      mensaje.setEnviado = true;
      expect(mensaje.enviado).toBe(true);
    });

    it('debería lanzar error si el valor no es booleano', () => {
      const mensaje = new Mensaje({
        pedidoId: 'pedido-1',
        senderId: 'usuario-1',
        senderType: 'CLIENTE',
        content: 'Hola',
      });

      expect(() => {
        mensaje.setEnviado = 'true';
      }).toThrow('El tipo a setear no es valido');
    });
  });
});
