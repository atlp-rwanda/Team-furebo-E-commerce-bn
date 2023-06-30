import express from 'express';
import {
  sendQuery,
  getAllQueries
} from '../controllers/customer-support.controller';
import { authorizeAdmin } from '../middlewares/userRoles.middleware';


const router = express.Router();


router.post('/sendQuery', sendQuery);
router.get('/getAllQueries', authorizeAdmin, getAllQueries);

export default router;