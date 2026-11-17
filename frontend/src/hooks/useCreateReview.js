import { useState, useCallback, useRef, useEffect } from 'react';
import { useApiClient } from '../services/apiClient';
import { buildReviewService } from '../services/reviewService';

export function useCreateReview() {
  const apiClient = useApiClient();
  const reviewService = buildReviewService(apiClient);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const createReview = useCallback(
    async ({ cliente, gig, pedido, puntuacion, detalle }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await reviewService.createReview({
          cliente,
          gig,
          pedido,
          puntuacion,
          detalle,
        });
        if (isMounted.current) {
          setLoading(false);
        }
        return { success: true, review: result };
      } catch (e) {
        if (isMounted.current) {
          setError(e.message);
          setLoading(false);
        }
        return { success: false, error: e.message };
      }
    },
    [reviewService]
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { createReview, loading, error, resetError };
}
