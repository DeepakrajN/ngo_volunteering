import express from 'express';
import { getClubs, getClubById, joinClub, getMyClubs, createClub, updateClub, deleteClub } from '../controllers/clubController.js';

const router = express.Router();

router.get('/', getClubs);
router.post('/', createClub);
router.get('/my-clubs', getMyClubs);
router.get('/:id', getClubById);
router.put('/:id', updateClub);
router.delete('/:id', deleteClub);
router.post('/join', joinClub);

export default router;
