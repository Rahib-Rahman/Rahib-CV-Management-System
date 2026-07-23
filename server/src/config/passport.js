import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ where: { googleId: profile.id } });
                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || null,
                        googleId: profile.id,
                        password: "oauth",
                        role: "candidate",
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3001/api/auth/facebook/callback",
            profileFields: ["id", "emails", "name"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email =
                    profile.emails && profile.emails[0]
                        ? profile.emails[0].value
                        : `${profile.id}@facebook.com`;

                let user = await User.findOne({ where: { facebookId: profile.id } });
                if (!user) {
                    user = await User.create({
                        name: `${profile.name.givenName} ${profile.name.familyName}`,
                        email,
                        facebookId: profile.id,
                        password: "oauth",
                        role: "candidate",
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;

