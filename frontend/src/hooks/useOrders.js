import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useApiClient } from '../services/apiClient';
import { useApp } from '../context/AppContext';

function normalizeOrder(pedido) {
  const gig = pedido.gigData || {};
  const paquete = pedido.paqueteData || {};
  const vendedor = pedido.vendedorData || {};

  return {
    id: pedido.id,
    status: pedido.estado,
    totalPrice: pedido.total,
    createdAt: pedido.fechaCreacion,
    deliveryDeadline: pedido.fechaEntregaEstimada || null,
    daysRemaining: pedido.diasEntregaRestantes ?? null,
    requirements: pedido.requerimientos,
    gig: {
      id: gig.id,
      title: gig.nombre,
      images: gig.multimedia || [],
    },
    package: {
      id: paquete.id,
      name: paquete.nombre,
      price: paquete.precio,
      deliveryDays: paquete.diasEntrega,
    },
    seller: {
      id: vendedor.id,
      name: vendedor.nombre ? `${vendedor.nombre} ${vendedor.apellido || ''}`.trim() : undefined,
      avatar: vendedor.avatar,
    },
    buyer: {
      id: pedido.cliente,
    },
    canceladoAt: pedido.canceladoAt,
    canceladoPorRol: pedido.canceladoPorRol,
    reembolso: pedido.reembolso,
  };
}

export function useOrders() {
  const { get } = useApiClient();
  const { activeOrders, completedOrders, setActive, setCompleted } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await get('/pedidos/mis-pedidos');
      if (isMounted.current) {
        const orders = (result.items || []).map(normalizeOrder);
        setActive(orders.filter((o) => o.status !== 'COMPLETADO'));
        setCompleted(orders.filter((o) => o.status === 'COMPLETADO'));
      }
    } catch (e) {
      if (isMounted.current) {
        setError(e.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [get, setActive, setCompleted]);

  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    isMounted.current = true;
    fetchOrders();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      activeCount: activeOrders.length,
      completedCount: completedOrders.length,
    }),
    [activeOrders.length, completedOrders.length]
  );

  return { ...counts, loading, error, refetch: fetchOrders };
}

export function useOrder(orderId) {
  const { get, post } = useApiClient();
  const { updateOrder } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get(`/pedidos/${orderId}`)
      .then((data) => {
        if (isMounted.current) {
          setOrder(normalizeOrder(data));
        }
      })
      .catch((e) => {
        if (isMounted.current) {
          setError(e.message);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
    return () => {
      isMounted.current = false;
    };
  }, [orderId, get]);

  const cancelOrder = useCallback(async () => {
    if (!orderId) return { success: false, error: 'No order ID' };
    setCancelling(true);
    setCancelError(null);
    try {
      const updated = await post(`/pedidos/${orderId}/cancel`, {});
      if (isMounted.current) {
        const normalized = normalizeOrder(updated);
        setOrder(normalized);
        updateOrder(normalized);
      }
      return { success: true, order: normalized };
    } catch (e) {
      if (isMounted.current) {
        setCancelError(e.message);
      }
      return { success: false, error: e.message };
    } finally {
      if (isMounted.current) {
        setCancelling(false);
      }
    }
  }, [orderId, post, updateOrder]);

  return { order, loading, error, setOrder, cancelOrder, cancelling, cancelError };
}
