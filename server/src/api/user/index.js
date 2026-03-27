import * as controller from './user.controller';
import Router from 'express';
import passport from 'passport';
import multer from 'multer';

var upload = multer({ dest: 'uploads/' });
const router = new Router();

router.post('/signup', controller.create);
router.get('/verify/', controller.emailVerification);
router.get('/info/:id', passport.authenticate('jwt', { session: false }), controller.getUserInfo);
router.post('/profile/:id', passport.authenticate('jwt', { session: false }),upload.single('avatar'), controller.update);

router.get('/authentication', passport.authenticate('jwt', { session: false }),function (req, res, next)  {
    res.status(200).json({status: 'ok'})
});


export default router;
