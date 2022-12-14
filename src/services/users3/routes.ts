import express from 'express';
import jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const user3Router = express.Router();

/** GET /api/users3 */
user3Router.route('/').get(controller.find);

/** GET /api/users3/:user3Id */
/** Authenticated route */
user3Router.route('/:user3Id').get(jwt(config), controller.get);

/** POST /api/users3 */
user3Router.route('/').post(controller.create);

/** PATCH /api/users3/:user3Id */
/** Authenticated route */
user3Router.route('/:user3Id').patch(jwt(config), controller.patch);

/** POST /api/users3 */
user3Router.route('/').delete(controller.deleteDatabase);