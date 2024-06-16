import connection from "../config/database.js";

const CelestialModel = {
  getAll: function (userId, callback) {
    connection.query(
      "SELECT * FROM celestial_objects WHERE user_id = ?",
      userId,
      callback
    );
  },

  create: function (celestialData, callback) {
    connection.query(
      `INSERT INTO celestial_objects (name, user_id) VALUES (?, ?)`,
      [celestialData.name, celestialData.userId],
      callback
    );
  },

  update: function (celestialData, callback) {
    connection.query(
      `UPDATE celestial_objects SET name = ? WHERE id = ?`,
      [celestialData.name, celestialData.id],
      callback
    );
  },

  delete: function (celestialId, callback) {
    connection.query(
      "DELETE FROM celestial_objects WHERE id = ?",
      celestialId,
      callback
    );
  },

  findbyUserandName: function (userId, name, callback) {
    connection.query(
      "SELECT * FROM celestial_objects WHERE user_id = ? AND name = ?",
      [userId, name],
      callback
    );
  },
};

export default CelestialModel;
