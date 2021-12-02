export const recoverException = (error, req, res, next) => {
  console.error("Error on request ", req.id, "error: ", error);
  return res.status(500).json({ errors: "internal server error" });
};
