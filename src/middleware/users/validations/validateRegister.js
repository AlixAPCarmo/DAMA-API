const validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Simple validation
  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({
      ok: false,
      data: [],
      error: "All fields are required.",
      status: 400,
    });
  }

  next();
};

export default validateRegister;
