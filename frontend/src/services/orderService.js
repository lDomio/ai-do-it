import { useApiClient } from './apiClient';

export function useOrderService() {
  const { post } = useApiClient();

  async function placeOrder(gigId, paqueteId, requerimientos, idempotencyKey = null) {
    const headers = {};
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }
    return post('/pedidos/reservar', { gigId, paqueteId, requerimientos }, headers);
  }

  return { placeOrder };
}
