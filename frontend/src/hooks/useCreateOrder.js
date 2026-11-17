import { useState, useCallback } from 'react';
import { useOrderService } from '../services/orderService';

function normalizeCreatedOrder(pedido) {
  return {
    id: pedido.id,
    total: pedido.total,
    fechaCreacion: pedido.fechaCreacion,
    estado: pedido.estado,
    cliente: pedido.cliente,
    gig: pedido.gig,
    paqueteId: pedido.paqueteId,
    requerimientos: pedido.requerimientos,
  };
}

export function useCreateOrder() {
  const { placeOrder } = useOrderService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const createOrder = useCallback(
    async (gigId, paqueteId, requerimientos, idempotencyKey = null) => {
      setLoading(true);
      setError(null);
      setOrder(null);
      try {
        const created = await placeOrder(gigId, paqueteId, requerimientos, idempotencyKey);
        const normalized = normalizeCreatedOrder(created);
        setOrder(normalized);
        return { success: true, order: normalized };
      } catch (e) {
        const message = e?.message || 'No se pudo crear el pedido';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [placeOrder]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setOrder(null);
  }, []);

  return { createOrder, loading, error, order, reset };
}
