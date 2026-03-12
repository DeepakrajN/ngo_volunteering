import express from 'express';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.post('/', addGalleryImage);
router.delete('/:id', deleteGalleryImage);

export default router;
