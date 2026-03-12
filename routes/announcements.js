import express from 'express';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', authenticateAdmin, createAnnouncement);
router.put('/:id', authenticateAdmin, updateAnnouncement);
router.delete('/:id', authenticateAdmin, deleteAnnouncement);

export default router;
