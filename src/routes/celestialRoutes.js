import CelestialController from "../controllers/celestialController.js";
import express from "express";

const router = express.Router();

router.get("/celestial", CelestialController.getAll);
router.post("/celestial", CelestialController.create);
router.put("/celestial", CelestialController.update);
router.delete("/celestial", CelestialController.delete);

export default router;
