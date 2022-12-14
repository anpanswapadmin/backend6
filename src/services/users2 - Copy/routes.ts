import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const user2Router = express.Router();

/** GET /api/users2 */
user2Router.route('/').get(controller.find);

/** GET /api/users2/:user2Id */
/** Authenticated route */
user2Router.route('/:user2Id').get(jwt(config), controller.get);

/** POST /api/users2 */
user2Router.route('/').post(controller.create);

/** PATCH /api/users2/:user2Id */
/** Authenticated route */
user2Router.route('/:user2Id').patch(jwt(config), controller.patch);

