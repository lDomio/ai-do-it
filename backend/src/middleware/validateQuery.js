export function validateQueryParams(validParams) {
  return (req, res, next) => {
    const invalidParams = Object.keys(req.query).filter((param) => !validParams.includes(param));

    if (invalidParams.length > 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Parámetros inválidos: ${invalidParams.join(', ')}`,
      });
    }

    next();
  };
}

export function validateSearchParam(req, res, next) {
  const { search } = req.query;

  if (search && search.length < 3) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'El término de búsqueda debe tener al menos 3 caracteres',
    });
  }

  next();
}

export function validateSortParam(req, res, next) {
  const { sortBy } = req.query;
  const validSortOptions = ['price', 'rating', 'date'];

  if (sortBy && !validSortOptions.includes(sortBy)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `sortBy debe ser uno de: ${validSortOptions.join(', ')}`,
    });
  }

  next();
}
