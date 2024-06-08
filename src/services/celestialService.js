import CelestialModel from "../models/celestialModel.js";

const CelestialService = {
  getAll: function (userId) {
    return new Promise((resolve, reject) => {
      CelestialModel.getAll(userId, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },

  create: function (celestialData) {
    return new Promise((resolve, reject) => {
      CelestialModel.create(celestialData, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },

  update: function (celestialData) {
    return new Promise((resolve, reject) => {
      CelestialModel.update(celestialData, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },

  delete: function (celestialId) {
    return new Promise((resolve, reject) => {
      CelestialModel.delete(celestialId, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
};

export default CelestialService;
