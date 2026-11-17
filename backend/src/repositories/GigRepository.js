import { Gig } from '../domain/Gig.js';

export class GigRepository {
  #gigs;
  #idCounter;

  constructor() {
    this.#gigs = new Map();
    this.#idCounter = 1;
  }

  findAll() {
    return Array.from(this.#gigs.values());
  }

  findById(id) {
    return this.#gigs.get(id) ?? null;
  }

  create(datos) {
    const id = String(this.#idCounter++);
    const { vendedor, paquetes = [], ...resto } = datos;
    const gig = new Gig({ vendedor });
    gig.id = id;
    Object.assign(gig, resto);
    gig.paquetes = paquetes.map((p, index) => ({ ...p, id: p.id || `pkg-${id}-${index}` }));
    this.#gigs.set(id, gig);
    return gig;
  }

  update(id, datos) {
    const gig = this.#gigs.get(id);
    if (!gig) return null;
    Object.assign(gig, datos);
    return gig;
  }

  delete(id) {
    const gig = this.#gigs.get(id);
    if (!gig) return false;
    this.#gigs.delete(id);
    return true;
  }

  deletePackage(gigId, packageId) {
    const gig = this.#gigs.get(gigId);
    if (!gig) return null;

    const index = gig.paquetes.findIndex((p) => p.id === packageId);
    if (index === -1) return { gig, found: false };

    gig.paquetes.splice(index, 1);
    return { gig, found: true };
  }
}
