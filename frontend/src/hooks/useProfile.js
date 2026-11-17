import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiClient } from '../services/apiClient';
import { useApp } from '../context/AppContext';

export function useProfile() {
  const { get } = useApiClient();
  const { updateUser } = useApp();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await get('/auth/me');
      if (isMounted.current) {
        const profile = {
          id: result.id,
          userId: result.id,
          name: `${result.nombre} ${result.apellido || ''}`.trim(),
          email: result.email,
          role: result.rol,
          avatar: result.avatar,
        };
        setProfile(profile);
        updateUser(profile);
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
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchProfile();
    return () => {
      isMounted.current = false;
    };
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}
