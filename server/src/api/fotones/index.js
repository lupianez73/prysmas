'use strict';
import passport from 'passport';
import { Router } from 'express';
import * as controller from './fotones.controller';

const router  = new Router();

router.get('/show/:id',passport.authenticate('jwt', { session: false }), controller.show);
router.get('/show',passport.authenticate('jwt', { session: false }),controller.showAll);
router.get('/images',controller.getImageToConvert);

module.exports = router;