export const registerUser = async (req, res, next) => {
  const { companyName, department, ...rest } = req.body;
  const role = rest.role || "external";

  // Block admin role registration
  if (["partnership-division", "general-director"].includes(role)) {
    return next(new AppError("Admin registration not allowed", 403));
  }

  // Validate required fields
  if (role === "external" && !companyName) {
    return next(new AppError("Company name required for external users", 400));
  }
  if (role === "internal" && !department) {
    return next(new AppError("Department required for internal users", 400));
  }

  try {
    const newUser = await User.create({
      ...rest,
      role,
      company: role === "external" ? { name: companyName } : undefined,
      department: role === "internal" ? department : undefined
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: { user: newUser }
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("Email already exists", 400));
    }
    next(new AppError(error.message || "Registration failed", 400));
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  
  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};