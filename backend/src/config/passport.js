import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Serialize: Save user ID to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize: Find user by ID from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Strategy 1: Local (Username/Password)
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "User not found" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: "Invalid password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Strategy 2: Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists by Google ID
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2. Generate a Unique Username
        // Remove spaces and special chars from Google name
        let baseUsername = profile.displayName
          .replace(/\s+/g, "")
          .toLowerCase();
        let uniqueUsername = baseUsername;

        // Check if this username is taken. If so, append random numbers until unique.
        while (await User.findOne({ username: uniqueUsername })) {
          uniqueUsername = `${baseUsername}${Math.floor(
            1000 + Math.random() * 9000
          )}`;
        }

        // 3. Create NEW user with flag TRUE
        user = new User({
          username: uniqueUsername,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
          needsUsernameChange: true, // [!code ++] Mark as needing setup
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
