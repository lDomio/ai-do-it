import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiClient } from '../services/apiClient';

function normalizeGig(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    ...raw,
    title: raw.title || raw.nombre,
    description: raw.description || raw.descripcion,
    category: raw.category || raw.categoria,
    categoryName: raw.categoryName || raw.categoriaNombre || '',
    tags: raw.tags || (raw.categoryName ? [raw.categoryName] : []),
    images: raw.images || raw.multimedia || [],
    packages: (raw.packages || raw.paquetes || []).map((p) => ({
      ...p,
      name: p.name || p.nombre,
      price: p.price ?? p.precio,
      deliveryDays: p.deliveryDays ?? p.diasEntrega,
      features: p.features || p.caracteristicas || [],
    })),
    seller:
      typeof raw.seller === 'object'
        ? raw.seller
        : typeof raw.vendedor === 'object'
          ? {
              id: raw.vendedor.id,
              name: `${raw.vendedor.nombre || ''} ${raw.vendedor.apellido || ''}`.trim(),
              avatar: raw.vendedor.avatar,
              rating: raw.vendedor.rating ?? 0,
              reviewCount: raw.vendedor.reviewCount ?? 0,
              stats: raw.vendedor.stats || { completed: 0 },
            }
          : { id: raw.vendedor, name: 'Vendedor' },
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
  };
}

function iconForCategory(nombre = '') {
  const map = {
    Diseño: 'color-palette',
    Desarrollo: 'code-slash',
    Marketing: 'trending-up',
    Redacción: 'pencil',
    Video: 'videocam',
    Datos: 'bar-chart',
    Música: 'musical-notes',
    IA: 'hardware-chip',
  };
  return map[nombre] || 'pricetag';
}

export function useGigs({ category = 'TODOS', search = '', page = 1 } = {}) {
  const { getWithParams } = useApiClient();
  const [gigs, setGigs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const isFetchingRef = useRef(false);

  const fetchGigs = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await getWithParams('/gigs', {
        search: search || undefined,
        category: category === 'TODOS' ? undefined : category,
        page,
        pageSize: 20,
      });
      if (isMounted.current) {
        setGigs((result.gigs || []).map(normalizeGig));
        setTotal(result.total || 0);
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
  }, [category, search, page, getWithParams]);

  useEffect(() => {
    isMounted.current = true;
    isFetchingRef.current = false;
    fetchGigs();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, page]);

  return { gigs, total, loading, error, refetch: fetchGigs };
}

export function useGig(gigId) {
  const { get } = useApiClient();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (!gigId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    get(`/gigs/${gigId}`)
      .then((data) => {
        if (isMounted.current) {
          setGig(normalizeGig(data));
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
  }, [gigId, get]);

  return { gig, loading, error };
}

export function useFeaturedGigs() {
  const { getWithParams } = useApiClient();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    getWithParams('/gigs', { sortBy: 'rating', pageSize: 8 })
      .then((res) => {
        if (isMounted.current) {
          setGigs((res.gigs || []).slice(0, 5).map(normalizeGig));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
    return () => {
      isMounted.current = false;
    };
  }, [getWithParams]);

  return { gigs, loading };
}

export function useTrendingGigs() {
  const { getWithParams } = useApiClient();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    getWithParams('/gigs', { sortBy: 'date', pageSize: 8 })
      .then((res) => {
        if (isMounted.current) {
          setGigs((res.gigs || []).slice(0, 5).map(normalizeGig));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
    return () => {
      isMounted.current = false;
    };
  }, [getWithParams]);

  return { gigs, loading };
}

export function useCategories() {
  const { get } = useApiClient();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    get('/categorias')
      .then((res) => {
        if (isMounted.current) {
          const raw = Array.isArray(res) ? res : res.categories || [];
          const mapped = raw.map((c) => ({
            id: c.id,
            name: c.nombre,
            icon: iconForCategory(c.nombre),
            description: c.descripcion,
          }));
          setCategories([{ id: 'TODOS', name: 'Todos', icon: 'grid' }, ...mapped]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
    return () => {
      isMounted.current = false;
    };
  }, [get]);

  return { categories, loading };
}

export function useCreateGig() {
  const { post } = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const createGig = useCallback(
    async (gigData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await post('/gigs', gigData);
        if (isMounted.current) {
          setLoading(false);
        }
        return result;
      } catch (e) {
        if (isMounted.current) {
          setError(e.message);
          setLoading(false);
        }
        throw e;
      }
    },
    [post]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { createGig, loading, error };
}

export function useUpdateGig() {
  const { put } = useApiClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const updateGig = useCallback(
    async (id, gigData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await put(`/gigs/${id}`, gigData);
        if (isMounted.current) {
          setLoading(false);
        }
        return result;
      } catch (e) {
        if (isMounted.current) {
          setError(e.message);
          setLoading(false);
        }
        throw e;
      }
    },
    [put]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { updateGig, loading, error };
}
