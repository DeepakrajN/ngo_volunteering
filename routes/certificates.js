import express from 'express';
import { generateCertificate, getCertificatesByVolunteer, getAllCertificatesByVolunteer, getCertificateById, getPendingCertificates, verifyCertificate, rejectCertificate } from '../controllers/certificateController.js';
import { authenticateAdmin, authenticateVolunteer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authenticateAdmin, generateCertificate);
router.get('/pending', authenticateAdmin, getPendingCertificates);
router.patch('/:id/verify', authenticateAdmin, verifyCertificate);
router.patch('/:id/reject', authenticateAdmin, rejectCertificate);
router.get('/volunteer/:volunteerId', authenticateVolunteer, getCertificatesByVolunteer);
router.get('/volunteer/:volunteerId/all', authenticateVolunteer, getAllCertificatesByVolunteer);
router.get('/:certificateId', getCertificateById);

export default router;
