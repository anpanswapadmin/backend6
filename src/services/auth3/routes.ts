import express from 'express';

import * as controller from './controller';

export const auth3Router = express.Router();

/** POST /api/auth2 */
auth3Router.route('/').post(controller.create);
