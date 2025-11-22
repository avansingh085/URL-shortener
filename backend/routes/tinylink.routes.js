import TinyLinkController from '../controllers/tinylink.controllers.js';
import express from 'express';

const router=express.Router();

router.get('/', TinyLinkController.GetAllLinks);

router.post('/', TinyLinkController.AddNewLink);

router.delete('/:code', TinyLinkController.DeleteLink);

router.get('/:code', TinyLinkController.RedirectLink);

export default router;
