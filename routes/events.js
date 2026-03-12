import express from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, registerForEvent, markAttendance, getEventAttendance, checkInToEvent } from '../controllers/eventController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/', authenticateAdmin, createEvent);
router.put('/:id', authenticateAdmin, updateEvent);
router.delete('/:id', authenticateAdmin, deleteEvent);
router.post('/register', registerForEvent);
router.post('/check-in', checkInToEvent);
router.post('/attendance', authenticateAdmin, markAttendance);
router.get('/:id/attendance', getEventAttendance);

export default router;
