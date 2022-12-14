import express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';

import { user2Router } from './users2';


export const services = express.Router();

services.use('/auth', authRouter);


services.use('/users', userRouter);
services.use('/users2', user2Router);

