import express from 'express';

import * as controller from './controller';

export const user2Router = express.Router();

/** GET /api/users2 */
user2Router.route('/').get(controller.find);

