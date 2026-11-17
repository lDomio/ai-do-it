import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiClient } from '../services/apiClient';
import { buildReviewService } from '../services/reviewService';

export function useReviews(gigId) {
  const apiClient = useApiClient();
  const reviewService = buildReviewService(apiClient);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ rating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const isFetchingRef = useRef(false);

  const fetchReviews = useCallback(async () => {
    if (!gigId) {
      setLoading(false);
      return;
    }
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await reviewService.getGigReviews(gigId);
      if (isMounted.current) {
        setReviews(result.reviews || []);
        setSummary({
          rating: result.rating || 0,
          reviewCount: result.reviewCount || 0,
        });
      }
    } catch (e) {
      if (isMounted.current) {
        setError(e.message);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [gigId, reviewService]);

  useEffect(() => {
    isMounted.current = true;
    isFetchingRef.current = false;
    fetchReviews();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gigId]);

  return { reviews, summary, loading, error, refetch: fetchReviews };
}
