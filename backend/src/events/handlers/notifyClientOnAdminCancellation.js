import { orderEvents } from '../index.js';

orderEvents.on('OrderCancelled', (payload) => {
  if (payload.canceladoPorRol !== 'admin') return;

  // TODO: reemplazar por el mecanismo real de notificaciones push/in-app
  // eslint-disable-next-line no-console
  console.log(
    `[Notificación] Pedido ${payload.pedidoId} cancelado por admin. Cliente: ${payload.clienteId}`
  );
});

export default {};
