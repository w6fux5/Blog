const notFoundMiddleware = (req, res) => {
  res.status(404).send(`Route not found - ${req.originalUrl}`);
};

export default notFoundMiddleware;
