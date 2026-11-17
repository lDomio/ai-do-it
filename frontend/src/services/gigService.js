import { Gig } from '../models/gig';
import { Categoria } from '../models/category';

function normalizeGig(json) {
  const gig = Gig.fromJSON(json);
  return {
    ...gig,
    title: gig.nombre,
    description: gig.descripcion,
    images: gig.multimedia,
    seller: normalizeSeller(gig.vendedor),
    rating: json.rating ?? json.vendedor?.rating ?? 0,
    reviewCount: json.reviewCount ?? json.vendedor?.reviewCount ?? 0,
    tags: json.tags || (gig.categoria ? [gig.categoria] : []),
    packages: (gig.paquetes || []).map((p) => ({
      ...p,
      name: p.nombre,
      price: p.precio,
      deliveryDays: p.diasEntrega,
      features: p.caracteristicas || (p.detalles ? [p.detalles] : []),
    })),
  };
}

function normalizeSeller(raw) {
  if (!raw || typeof raw !== 'object') {
    return { id: raw, name: 'Vendedor', avatar: undefined };
  }
  return {
    id: raw.id,
    name: raw.name || `${raw.nombre || ''} ${raw.apellido || ''}`.trim() || 'Vendedor',
    avatar: raw.avatar,
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    stats: raw.stats || {
      completed: raw.trabajosCompletados ?? 0,
      active: 0,
    },
  };
}

export class GigService {
  #baseUrl;

  constructor(baseUrl = 'http://localhost:3000') {
    this.#baseUrl = baseUrl;
  }

  async searchGigs({ search, category, sortBy, page, pageSize } = {}) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sortBy) params.set('sortBy', sortBy);
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));

    const qs = params.toString();
    const url = `${this.#baseUrl}/gigs${qs ? `?${qs}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error?.message || body.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return {
      gigs: (data.gigs || []).map(normalizeGig),
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    };
  }

  async getGigById(id) {
    const response = await fetch(`${this.#baseUrl}/gigs/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error?.message || body.message || `Error ${response.status}`);
    }

    return normalizeGig(await response.json());
  }

  async getCategories() {
    const response = await fetch(`${this.#baseUrl}/categorias`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error?.message || body.message || `Error ${response.status}`);
    }

    const data = await response.json();
    return data.map((c) => ({ id: c.id, name: c.nombre, description: c.descripcion }));
  }

  async createGig(gigData) {
    const response = await fetch(`${this.#baseUrl}/gigs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(gigData),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error?.message || body.error || `Error ${response.status}`);
    }

    return normalizeGig(await response.json());
  }

  async updateGig(id, gigData) {
    const response = await fetch(`${this.#baseUrl}/gigs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(gigData),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error?.message || body.error || `Error ${response.status}`);
    }

    return normalizeGig(await response.json());
  }
}
