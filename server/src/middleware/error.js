export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express 5 forwards rejected promises from async handlers here automatically.
export function errorHandler(err, req, res, _next) {
  if (err?.code === 11000) {
    return res.status(409).json({ message: "That value is already taken" });
  }
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : "Something went wrong on our side",
  });
}
