import { Router } from 'express';
import strategy from './strategy';
const router = new Router();


router.post('/',strategy);


module.exports = router;