const validateDelete = (req, res, next) => {
  const {
    userID,
  } = req.body;

  // Simple validation
  if (!userID) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: "All fields are required.",
      status: 400,
    });
  }

  next();
};

export default validateDelete;
