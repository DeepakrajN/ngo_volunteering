import express from 'express';
import { registerVolunteer, loginVolunteer, getVolunteers, getVolunteerById, getVolunteerProfile, updateVolunteerProfile, deleteVolunteer } from '../controllers/volunteerController.js';
import { authenticateVolunteer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerVolunteer);
router.post('/login', loginVolunteer);
router.get('/', getVolunteers);
router.get('/me', authenticateVolunteer, getVolunteerProfile);
router.put('/me', authenticateVolunteer, updateVolunteerProfile);
router.get('/:id', getVolunteerById);
router.delete('/:id', deleteVolunteer);

export default router;
