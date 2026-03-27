import Router from 'express';
const router = new Router();

//Routes
router.use('/',require('./api/auth').default)
router.use('/login',require('./api/account/login').default)
router.use('/user',require('./api/user/').default)
router.use('/fotones',require('./api/fotones'));


export default router;