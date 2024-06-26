import CelestialService from "../services/celestialService.js";

const CelestialController = {
  getAll: async (req, res) => {
    try {
      const userId = req.user.user_id; // Corrected field
      const celestials = await CelestialService.getAll(userId);
      res.status(200).json({
        ok: true,
        data: celestials,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        ok: false,
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const userId = req.user.user_id; 
      const celestialData = { ...req.body, userId };

      if (!celestialData.name) {
        return res.status(400).json({
          ok: false,
          data: null,
          error: "Name is required",
        });
      }

      // check if celestial object already exists for user 
      const existingCelestial = await CelestialService.findbyUserandName(userId, celestialData.name);

      if (existingCelestial.length > 0) {
        return res.status(400).json({
          ok: false,
          data: null,
          error: "Celestial object already exists for user",
        });
      }
      
      const newCelestial = await CelestialService.create(celestialData);
      res.status(201).json({
        ok: true,
        data: "Celestial object created successfully , id: " + newCelestial.insertId,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        data: null,
        ok: false,
        error: "Error saving celestial object",
      });
    }
  },

  update: async (req, res) => {
    try {
      const celestialData = req.body;

      if (!celestialData.id || !celestialData.name) {
        return res.status(400).json({
          ok: false,
          data: null,
          error: "Fields id and name are required",
        });
      }
      const updatedCelestial = await CelestialService.update(celestialData);
      res.status(200).json({
        ok: true,
        data: "Celestial object updated successfully",
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        data: null,
        error: "Error updating celestial object",
      });
    }
  },

  delete: async (req, res) => {
    try {
      const celestialId = req.body.id;
      await CelestialService.delete(celestialId);
      res.status(200).json({
        ok: true,
        data: "Celestial object deleted successfully",
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        data: null,
        error: "Error deleting celestial object",
      });
    }
  },

  findbyUserAndName: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const name = req.body.name;
      const celestial = await CelestialService.findbyUserandName(userId, name);
      res.status(200).json({
        ok: true,
        data: celestial[0].id,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        data: null,
        error: "Error finding celestial object",
      });
    }
  },
};

export default CelestialController;
