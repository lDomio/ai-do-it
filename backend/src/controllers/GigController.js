import { ValidationError, NotFoundError } from '../errors/index.js';
import { GigService } from '../services/GigService.js';

export class GigController {
  #service;

  constructor(service = new GigService()) {
    this.#service = service;
  }

  findAll(req, res, next) {
    try {
      const { search, category, sortBy, page: rawPage, pageSize: rawPageSize } = req.query;

      const validSortOptions = ['price', 'rating', 'date'];
      if (sortBy && !validSortOptions.includes(sortBy)) {
        throw new ValidationError(`sortBy debe ser uno de: ${validSortOptions.join(', ')}`);
      }

      if (search && search.length < 3) {
        throw new ValidationError('El término de búsqueda debe tener al menos 3 caracteres');
      }

      const page = Math.max(1, rawPage != null ? Number(rawPage) : 1);
      const pageSize = Math.min(100, Math.max(1, rawPageSize != null ? Number(rawPageSize) : 10));

      const { items, total, totalPages } = this.#service.searchGigs({
        search,
        category: category || undefined,
        sortBy: sortBy || undefined,
        page,
        pageSize,
      });

      res.json({
        gigs: items,
        total,
        page,
        pageSize,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  findById(req, res, next) {
    try {
      const gig = this.#service.findById(req.params.id);
      if (!gig) {
        throw new NotFoundError('Gig no encontrado');
      }
      res.json(gig);
    } catch (error) {
      next(error);
    }
  }

  create(req, res, next) {
    try {
      const gig = this.#service.create(req.body);
      res.status(201).json(gig);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const gig = this.#service.update(req.params.id, req.body);
      res.json(gig);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const eliminado = this.#service.delete(req.params.id);
      if (!eliminado) {
        throw new NotFoundError('Gig no encontrado');
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  deletePackage(req, res, next) {
    try {
      const result = this.#service.deletePackage(req.params.id, req.params.packageId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  getReviews(req, res, next) {
    try {
      const gig = this.#service.findById(req.params.id);
      if (!gig) {
        throw new NotFoundError('Gig no encontrado');
      }

      const rawPage = req.query.page;
      const rawPageSize = req.query.pageSize;
      const page = Math.max(1, rawPage != null ? Number(rawPage) : 1);
      const pageSize = Math.min(100, Math.max(1, rawPageSize != null ? Number(rawPageSize) : 10));

      const allReviews = this.#service.getReviewsForGig
        ? this.#service.getReviewsForGig(gig.id)
        : [];
      const total = allReviews.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const inicio = (page - 1) * pageSize;
      const reviews = allReviews.slice(inicio, inicio + pageSize);

      res.json({
        gigId: gig.id,
        rating: gig.rating ?? 0,
        reviewCount: gig.reviewCount ?? 0,
        reviews,
        total,
        page,
        pageSize,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
}
