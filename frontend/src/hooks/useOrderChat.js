import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiClient } from '../services/apiClient';

const MAX_MESSAGE_LENGTH = 2000;
const POLL_INTERVAL_MS = 5000;

export function useOrderChat(orderId, isFocused = true) {
  const { get, post } = useApiClient();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const intervalRef = useRef(null);
  const optimisticIdsRef = useRef(new Set());
  const initialFetchRef = useRef(false);

  const normalizeMessage = useCallback((msg) => {
    if (!msg || typeof msg !== 'object') return null;
    return {
      id: msg.id,
      orderId: msg.orderId || msg.pedidoId,
      senderId: msg.senderId,
      senderType: msg.senderType,
      content: msg.content,
      status: msg.status || 'ENVIADO',
      createdAt: msg.createdAt,
    };
  }, []);

  const mergeMessages = useCallback((fetched) => {
    setMessages((current) => {
      const serverIds = new Set(fetched.map((m) => m.id));
      const keptOptimistic = current.filter(
        (m) => m.status !== 'ENVIADO' || serverIds.has(m.id) || optimisticIdsRef.current.has(m.id)
      );
      const mergedMap = new Map();
      keptOptimistic.forEach((m) => mergedMap.set(m.id, m));
      fetched.forEach((m) => {
        const existing = mergedMap.get(m.id);
        if (!existing || existing.status === 'PENDIENTE' || existing.status === 'FALLIDO') {
          mergedMap.set(m.id, m);
          optimisticIdsRef.current.delete(m.id);
        }
      });
      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!orderId) return;
    setLoading((wasLoading) => (initialFetchRef.current ? wasLoading : true));
    setError(null);
    try {
      const result = await get(`/pedidos/${orderId}/messages`);
      const fetched = (result.messages || [])
        .map(normalizeMessage)
        .filter(Boolean)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      mergeMessages(fetched);
      setUnreadCount(result.unreadCount || 0);
    } catch (e) {
      setError(e.message || 'Failed to fetch messages');
      console.error('Failed to fetch messages:', e);
    } finally {
      setLoading(false);
      initialFetchRef.current = true;
    }
  }, [orderId, get, normalizeMessage, mergeMessages]);

  useEffect(() => {
    if (!initialFetchRef.current) {
      fetchMessages();
    }
  }, [fetchMessages]);

  useEffect(() => {
    if (!orderId || !isFocused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      fetchMessages();
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderId, isFocused, fetchMessages]);

  const validateContent = useCallback((content) => {
    const trimmed = typeof content === 'string' ? content.trim() : '';
    if (trimmed.length === 0) {
      return { valid: false, error: 'El mensaje no puede estar vacio' };
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return {
        valid: false,
        error: `El mensaje no puede exceder los ${MAX_MESSAGE_LENGTH} caracteres`,
      };
    }
    return { valid: true, content: trimmed };
  }, []);

  const addOptimisticMessage = useCallback((optimisticMessage) => {
    setMessages((current) =>
      [...current, optimisticMessage].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );
    optimisticIdsRef.current.add(optimisticMessage.id);
  }, []);

  const replaceOptimisticMessage = useCallback((optimisticId, confirmed) => {
    setMessages((current) => {
      const filtered = current.filter((m) => m.id !== optimisticId);
      optimisticIdsRef.current.delete(optimisticId);
      return [...filtered, confirmed].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });
  }, []);

  const markOptimisticFailed = useCallback((optimisticId) => {
    setMessages((current) =>
      current.map((m) => (m.id === optimisticId ? { ...m, status: 'FALLIDO' } : m))
    );
  }, []);

  const sendMessage = useCallback(
    async (content) => {
      if (!orderId || sending) return { success: false };
      const validation = validateContent(content);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const trimmed = validation.content;
      const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimisticMessage = {
        id: optimisticId,
        orderId,
        senderId: 'me',
        senderType: 'BUYER',
        content: trimmed,
        status: 'PENDIENTE',
        createdAt: new Date().toISOString(),
      };

      addOptimisticMessage(optimisticMessage);
      setSending(true);

      try {
        const result = await post(`/pedidos/${orderId}/messages`, { content: trimmed });
        const confirmed = normalizeMessage(result);
        if (!confirmed) {
          throw new Error('Respuesta invalida del servidor');
        }

        replaceOptimisticMessage(optimisticId, confirmed);
        return { success: true, message: confirmed };
      } catch (e) {
        markOptimisticFailed(optimisticId);
        const errorMessage = e.message || 'Failed to send message';
        setError(errorMessage);
        return { success: false, error: errorMessage, optimisticId };
      } finally {
        setSending(false);
      }
    },
    [
      orderId,
      sending,
      post,
      validateContent,
      normalizeMessage,
      addOptimisticMessage,
      replaceOptimisticMessage,
      markOptimisticFailed,
    ]
  );

  const retryMessage = useCallback(
    async (optimisticId) => {
      const message = messages.find((m) => m.id === optimisticId);
      if (!message || message.status !== 'FALLIDO') return { success: false };
      setMessages((current) =>
        current.map((m) => (m.id === optimisticId ? { ...m, status: 'PENDIENTE' } : m))
      );
      try {
        const result = await post(`/pedidos/${orderId}/messages`, { content: message.content });
        const confirmed = normalizeMessage(result);
        if (!confirmed) throw new Error('Respuesta invalida del servidor');
        replaceOptimisticMessage(optimisticId, confirmed);
        return { success: true, message: confirmed };
      } catch (e) {
        markOptimisticFailed(optimisticId);
        const errorMessage = e.message || 'Failed to retry message';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [messages, orderId, post, normalizeMessage, replaceOptimisticMessage, markOptimisticFailed]
  );

  return {
    messages,
    unreadCount,
    loading,
    error,
    sending,
    sendMessage,
    retryMessage,
    refetch: fetchMessages,
    validateContent,
  };
}
