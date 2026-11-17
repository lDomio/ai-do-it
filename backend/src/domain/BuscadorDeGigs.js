class PriceSort {
  sort(gigs) {
    return [...gigs].sort((a, b) => {
      const priceA = Number(a.paquetes?.reduce((sum, p) => sum + (p.precio || 0), 0) || 0);
      const priceB = Number(b.paquetes?.reduce((sum, p) => sum + (p.precio || 0), 0) || 0);
      return priceA - priceB;
    });
  }
}

class RatingSort {
  sort(gigs) {
    return [...gigs].sort((a, b) => Number(b.ratingPromedio || 0) - Number(a.ratingPromedio || 0));
  }
}

class DateSort {
  sort(gigs) {
    return [...gigs].sort((a, b) => {
      const dateA = new Date(a.fechaCreacion || 0);
      const dateB = new Date(b.fechaCreacion || 0);
      return Number(dateB) - Number(dateA);
    });
  }
}

export class BuscadorDeGigs {
  static instanciarOrdenador(tipo = 'date') {
    switch (tipo) {
      case 'price':
        return new PriceSort();
      case 'rating':
        return new RatingSort();
      case 'date':
        return new DateSort();
      default:
        return new DateSort();
    }
  }

  static paginar(items, { page = 1, pageSize = 10 } = {}) {
    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);
    return {
      items: paged,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
