import { GigRepository } from '../repositories/GigRepository.js';
import { BuscadorDeGigs } from '../domain/BuscadorDeGigs.js';
import { ValidationError, NotFoundError } from '../errors/index.js';

export class GigService {
  #repository;
  #opinionService;
  #categoryRepository;

  constructor(repository = new GigRepository(), opinionService = null, categoryRepository = null) {
    this.#repository = repository;
    this.#opinionService = opinionService;
    this.#categoryRepository = categoryRepository;
  }

  #enriquecerGig(gig) {
    if (!gig) {
      return gig;
    }
    const gigJson = typeof gig.toJSON === 'function' ? gig.toJSON() : gig;
    const extras = {};

    if (this.#opinionService) {
      const { rating, reviewCount } = this.#opinionService.calcularRating(gig.id);
      extras.rating = rating;
      extras.reviewCount = reviewCount;
    }

    if (this.#categoryRepository && gig.categoria) {
      const categoria = this.#categoryRepository.findById(gig.categoria);
      if (categoria) {
        extras.categoryName = categoria.nombre;
      }
    }

    return { ...gigJson, ...extras };
  }

  findAll() {
    return this.#repository.findAll();
  }

  findById(id) {
    const gig = this.#repository.findById(id);
    return this.#enriquecerGig(gig);
  }

  create(datos) {
    this.#validarGig(datos);
    this.#validarPaquetes(datos.paquetes);
    return this.#repository.create(datos);
  }

  update(id, datos) {
    const gig = this.#repository.findById(id);
    if (!gig) {
      throw new NotFoundError('Gig no encontrado');
    }
    if (datos.paquetes) {
      this.#validarPaquetes(datos.paquetes);
    }
    return this.#repository.update(id, datos);
  }

  delete(id) {
    return this.#repository.delete(id);
  }

  deletePackage(gigId, packageId) {
    const result = this.#repository.deletePackage(gigId, packageId);
    if (result === null) {
      throw new NotFoundError('Gig no encontrado');
    }
    if (!result.found) {
      throw new NotFoundError('Paquete no encontrado en el gig');
    }
    if (result.gig.paquetes.length < 1) {
      throw new ValidationError('No se puede eliminar: al menos un paquete es requerido');
    }
    return {
      success: true,
      remainingPackages: result.gig.paquetes.length,
    };
  }

  searchGigs({ search, category, sortBy, page, pageSize } = {}) {
    let results = this.#repository.findAll();

    if (search && search.length >= 3) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (gig) =>
          gig.nombre?.toLowerCase().includes(searchLower) ||
          gig.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      results = results.filter((gig) => gig.categoria === category);
    }

    const sortStrategy = BuscadorDeGigs.instanciarOrdenador(sortBy);
    results = sortStrategy.sort(results);

    const paginado = BuscadorDeGigs.paginar(results, { page, pageSize });
    paginado.items = this.enrichGigs(paginado.items);
    return paginado;
  }

  enrichGigs(results) {
    return results.map((gig) => this.#enriquecerGig(gig));
  }

  getReviewsForGig(gigId) {
    if (!this.#opinionService) {
      return [];
    }
    return this.#opinionService.findByGigId(gigId);
  }

  #validarGig(datos) {
    if (!datos.nombre || datos.nombre.trim().length === 0) {
      throw new ValidationError('Nombre del gig es requerido');
    }
    if (!datos.descripcion || datos.descripcion.trim().length === 0) {
      throw new ValidationError('Descripcion del gig es requerida');
    }
    if (!datos.paquetes || !Array.isArray(datos.paquetes)) {
      throw new ValidationError('Al menos un paquete es requerido');
    }
  }

  #validarPaquetes(paquetes) {
    if (!paquetes || paquetes.length === 0) {
      throw new ValidationError('Al menos un paquete es requerido');
    }
    if (paquetes.length > 3) {
      throw new ValidationError('Maximo 3 paquetes por gig');
    }
    for (const paquete of paquetes) {
      if (!paquete.nombre || paquete.nombre.trim().length === 0) {
        throw new ValidationError('Nombre del paquete es requerido');
      }
      if (paquete.precio === undefined || paquete.precio === null || paquete.precio < 0) {
        throw new ValidationError('El precio del paquete debe ser un numero no negativo');
      }
      if (
        paquete.diasEntrega === undefined ||
        paquete.diasEntrega === null ||
        paquete.diasEntrega < 0
      ) {
        throw new ValidationError('Los dias de entrega deben ser un numero no negativo');
      }
      if (!paquete.descripcion || paquete.descripcion.trim().length === 0) {
        throw new ValidationError('La descripcion del paquete es requerida');
      }
    }
  }
}
