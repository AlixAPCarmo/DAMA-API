import express from "express";
import passport from "passport";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";
import celestialRoutes from "./routes/celestialRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", userRoutes);
app.use("/api", celestialRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    data: [],
    status: 404,
    error: "Not found",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    ok: false,
    message: "Something broke!",
    error: error.message,
    status: 500,
  });
});

export default app;
