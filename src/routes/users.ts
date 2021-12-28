/* eslint-disable max-len */
import express from 'express';
import users from '../services/users';
import { getUserFromToken } from '../utils/middleware';


const userRouter = express.Router();


userRouter.post('/', async (req, res) => {
  const {
    username,
    password,
    email,
    currentKnownLanguageId,
    currentLearnLanguageId,
  } = req.body;

  const newUser = await users.addNew(username, password, email, currentKnownLanguageId, currentLearnLanguageId);

  res.status(201).json(newUser);
});


userRouter.get('/', async (_req, res) => {
  const allUsers = await users.getAll();
  res.json(allUsers);
});


userRouter.put('/change-password', getUserFromToken, async (req, res) => {
  const { user } = res.locals;
  const { currentPassword, newPassword } = req.body;

  const response = await users.updatePassword(user.id, currentPassword, newPassword);

  res.json(response);
});


userRouter.delete('/', getUserFromToken, async (req, res) => {
  const { user } = res.locals;
  const { password } = req.body;

  await users.remove(user.id, password);

  res.status(204);
});


// update user languages
userRouter.put('/set-languages', getUserFromToken, async (req, res) => {
  const { user } = res.locals;

  const { currentKnownLanguageId, currentLearnLanguageId } = req.body;

  const updatedUser = await users.setUserLanguages(
    currentKnownLanguageId,
    currentLearnLanguageId,
    user.id,
  );

  return res.json(updatedUser);
});


export default userRouter;
