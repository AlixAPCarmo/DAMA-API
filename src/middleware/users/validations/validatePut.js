const validatePut = (req, res, next) => {
  const { firstName, lastName, role } = req.body;

  // Simple validation
  if (!firstName || !lastName || !role) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: "All fields are required.",
      status: 400,
    });
  }

  next();
};

export default validatePut;
