export function buildReviewService(apiClient) {
  return {
    async createReview({ cliente, gig, pedido, puntuacion, detalle }) {
      return apiClient.post('/opiniones', {
        cliente,
        gig,
        pedido,
        puntuacion,
        detalle,
      });
    },

    async getGigReviews(gigId, page = 1, pageSize = 10) {
      const result = await apiClient.get(`/gigs/${gigId}/reviews`, { page, pageSize });
      return {
        reviews: (result.reviews || []).map((r) => ({
          id: r.id,
          gigId: r.gig,
          pedidoId: r.pedido,
          clienteId: r.cliente,
          rating: r.puntuacion,
          comment: r.detalle,
          createdAt: r.fechaCreacion,
        })),
        rating: result.rating || 0,
        reviewCount: result.reviewCount || 0,
      };
    },
  };
}
