import express from 'express';
import words from '../services/words';

const router = express.Router();

router.get('/', async(_req, res) => {
  const allWords = await words.getAll();
  res.send(allWords);
});

router.get('/:id', async(req, res) => {
  const id = Number(req.params.id);

  const wordById = await words.getById(id);
  res.send(wordById);
});

router.get('/:langId/user/:userId', async(req, res) => {
  const { langId } = req.params;
  const userId = {
    user: req.params.userId,
  };

  const wordsByLanguageAndUser = await words.getByLanguageAndUser(langId, Number(userId.user));
  res.send(wordsByLanguageAndUser);
});

router.post('/user/:userId', async(req, res) => {
  const data = req.body;
  const userId = Number(req.params.userId);

  const updatedWord = await words.addNew(data);
  const wordId = updatedWord?.id;

  if (!wordId) return;
  const updateStatus = await words.addStatus(wordId, userId, 'learning');
  res.send(updateStatus);
});

router.put('/word/:wordId/user/:userId', async(req, res) => {
  const { status } = req.body;
  const { wordId, userId } = req.params;

  const updatedWord = await words.updateStatus(Number(wordId), Number(userId), status);
  res.send(updatedWord);
});

export default router;
