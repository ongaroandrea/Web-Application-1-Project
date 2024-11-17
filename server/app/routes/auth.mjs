import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { FailedLogin, NotAuthenticated, NotAuthenticatedAdmin, MissingFields, UserAlreadyExists } from '../errors/authErrors.mjs';
/*** Importing modules ***/
import UserDAO from "../dao/user.mjs"

export default class Authenticator {

  userDao = null
  app = null

  constructor(app) {
    this.app = app
    this.userDao = new UserDAO()
    this.initAuth()
  }

  initAuth() {
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }));

    this.app.use(passport.authenticate('session'));

    passport.use(new LocalStrategy(async function verify(username, password, callback) {
      this.userDao = new UserDAO()
      const user = await this.userDao.getUserByCredentials(username, password)
      if (!user)
        return callback(null, false, 'Incorrect username or password');

      return callback(null, user);
    }));

    // Serializing in the session the user object given from LocalStrategy(verify).
    passport.serializeUser(function (user, callback) { // this user is id + username + name
      callback(null, user);
    });

    // Starting from the data in the session, we extract the current (logged-in) user.
    passport.deserializeUser(function (user, callback) { 
      let us = new UserDAO()
      
      return us.getUserByID(user.id)
        .then(user_s => {
          callback(null, user_s)})
        .catch(err => {
          callback(err, null)
        });

    });

    async function loginAsync(req, user) {
      return new Promise((resolve, reject) => {
        req.login(user, (err) => {
          if (err) reject(err);
          else resolve(req.user);
        });
      });
    }

    // POST /api/sessions
    this.app.post('/api/sessions', function (req, res, next) {
      passport.authenticate('local', async (err, user, info) => {
        if (err)
          return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ message: info });
        }
        // success, perform the login and extablish a login session
        try {
          const user_info = await loginAsync(req, user);
          return res.json(user_info);
        } catch (err) {
          throw new FailedLogin();
        }
      })(req, res, next)
    });

    // GET /api/sessions/current
    // This route checks whether the user is logged in or not.
    this.app.get('/api/sessions/current', (req, res) => {
      if (req.isAuthenticated()) {
        res.status(200).json(req.user);
      }
      else {
        throw new NotAuthenticated();
      }
    });

    // DELETE /api/session/current
    // This route is used for loggin out the current user.
    this.app.delete('/api/sessions/current', (req, res) => {
      req.logout(() => {
        res.end();
      });
    });

    // POST /api/sign_in
    // This route is used for signing up a new user.
    this.app.post('/api/sign_in', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password)
        return res.status(422).json({ message: 'Missing fields' });

      try {
        const checkExistingUser = await this.userDao.getUserByUsername(username);
        if (checkExistingUser)
          return res.status(409).json({ message: 'User already exists' });

        const user = await this.userDao.createUser(username, password);
        return res.status(201).json()
      } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
      }
    })
  }
}

// Middleware to check if the user is authenticated
export function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  throw new NotAuthenticated();
}

// Middleware to check if the user is an admin
export function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin')
    return next();
  throw new NotAuthenticatedAdmin();
}
