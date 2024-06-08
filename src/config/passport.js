import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import connection from "./database.js";

//passport local strategy
passport.use(
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        function (err, results) {
          if (err) {
            return done(err);
          }
          if (results.length === 0) {
            return done(null, false, { message: "Incorrect email." });
          }
          const user = results[0];
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              return done(err);
            }
            if (!result) {
              return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
          });
        }
      );
    }
  )
);

// Passport serializeUser and deserializeUser
passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});

passport.deserializeUser(function (id, done) {
  connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [id],
    function (err, results) {
      if (err) {
        return done(err);
      }
      done(null, results[0]);
    }
  );
});

export default passport;
