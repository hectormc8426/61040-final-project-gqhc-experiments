import type { Request, Response, NextFunction } from 'express';
import UserCollection from '../user/collection';
import { questNames } from './model';

/**
 * Checks if the current session user (if any) still exists in the database, for instance,
 * a user may try to post a freet in some browser while the account has been deleted in another or
 * when a user tries to modify an account in some browser while it has been deleted in another
 */
const isCurrentSessionUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    const user = await UserCollection.findOneByUserId(req.session.userId);

    if (!user) {
      req.session.userId = undefined;
      res.status(500).json({
        error: 'User session was not recognized.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a username in req.body is valid, that is, it matches the username regex
 */
const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test(req.body.username)) {
    res.status(400).json({
      error: 'Username must be a nonempty alphanumeric string.'
    });
    return;
  }
  if (req.body.username && req.body.username.length > 20) {
    res.status(400).json({
      error: 'Username must not be more than 20 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if a password in req.body is valid, that is, at 6-50 characters long without any spaces
 */
const isValidPassword = (req: Request, res: Response, next: NextFunction) => {
  const passwordRegex = /^\S+$/;
  if (!passwordRegex.test(req.body.password)) {
    res.status(400).json({
      error: 'Password must be a nonempty string.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username and password in req.body exists
 */
const isAccountExists = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body as { username: string; password: string };

  if (!username || !password) {
    res.status(400).json({ error: `Missing ${username ? 'password' : 'username'} credentials for sign in.` });
    return;
  }

  const user = await UserCollection.findOneByUsernameAndPassword(
    username, password
  );

  if (user) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid user login credentials provided.' });
  }
};

/**
 * Checks if a given quest to update is a quest that exists.
 */
const isValidQuestName = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.quest !== undefined) { // If a quest is not being changed, skip this check
    if (!questNames.has(req.body.quest.name)) {
      res.status(404).json({ error: `Invalid quest name: ${req.body.quest.name} given. Quest does not exist!` });
      return;
    }
  }

  next();
};

/**
 * Checks if a given quest to update has proper formatting
 */
const isValidQuestFormat = async (req: Request, res: Response, next: NextFunction) => {

  if (req.body.quest !== undefined) { // If a quest is not being changed, skip this check
    const quest = req.body.quest;

    if (quest.name == undefined || typeof quest.name !== "string") {
      res.status(400).json({ error: `Improper formatting of quest: missing field 'name' or invalid value. Expected 'name' of type string.` });
      return;
    }
    if (quest.desc == undefined || typeof quest.desc !== "string") {
      res.status(400).json({ error: `Improper formatting of quest: missing field 'desc' or invalid value. Expected 'desc' of type string.` });
      return;
    }
    if (quest.currentProgress == undefined || typeof quest.currentProgress !== "number") {
      res.status(400).json({ error: `Improper formatting of quest: missing field 'currentProgress' or invalid value. Expected 'currentProgress' of type number.` });
      return;
    }
    if (quest.goalProgress == undefined || typeof quest.goalProgress !== "number") {
      res.status(400).json({ error: `Improper formatting of quest: missing field 'goalProgress' or invalid value. Expected 'goalProgress' of type number.` });
      return;
    }
    if (quest.reward == undefined || typeof quest.reward !== "number") {
      res.status(400).json({ error: `Improper formatting of quest: missing field 'reward' or invalid value. Expected 'reward' of type number.` });
      return;
    }
    if (quest.repeatAmount == undefined || typeof quest.repeatAmount !== "number") {
      res.status(400).json({
        error: `Improper formatting of quest: missing field 'repeatAmount' or invalid value. Expected 'repeatAmount' of type number. 
      Got ${quest.repeatAmount} or type ${typeof quest.repeatAmount}`
      });
      console.log(req.body.quest);
      return;
    }
  }

  next();
};

/**
 * Checks if a username in req.body is already in use
 */
const isUsernameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.username !== undefined) { // If username is not being changed, skip this check
    const user = await UserCollection.findOneByUsername(req.body.username);

    // If the current session user wants to change their username to one which matches
    // the current one irrespective of the case, we should allow them to do so
    if (user && (user?._id.toString() !== req.session.userId)) {
      res.status(409).json({
        error: 'An account with this username already exists.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user is logged in, that is, whether the userId is set in session
 */
const isUserLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(403).json({
      error: 'You must be logged in to complete this action.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user is signed out, that is, userId is undefined in session
 */
const isUserLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    res.status(403).json({
      error: 'You are already signed in.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as user id in req.query exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  let userId = req.query.userId;

  if (!userId) {
    next();
    return;
  }

  const user = await UserCollection.findOneByUsername(userId as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${userId as string} does not exist.`
    });
    return;
  }

  next();
};


export {
  isCurrentSessionUserExists,
  isUserLoggedIn,
  isUserLoggedOut,
  isUsernameNotAlreadyInUse,
  isAccountExists,
  isUserExists,
  isValidUsername,
  isValidPassword,
  isValidQuestFormat,
  isValidQuestName,
};
