import express from 'express';

import * as controller from './controller';

export const auth2Router = express.Router();

/** POST /api/auth2 */
auth2Router.route('/').post(controller.create);
