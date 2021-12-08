import bcrypt from 'bcrypt';
import express from 'express';
import { selectAllUsers, addNewUser } from '../services/users'; // needs to be implemented
import { User } from '../types';

const userRouter = express.Router();

userRouter.post('/', async (req, res, next) => {
  const { username, password, email } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser: User = {
    username,
    passwordHash,
    email,
  };

  try {
    const userCreated = await addNewUser(newUser);

    if (userCreated) {
      res.send(`User ${newUser.username} succesfully created`);
    } else {
      res.send('Something went wrong');
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get('/', async (_req, res) => {
  const users = await selectAllUsers();
  res.send(users);
});

export default userRouter;
