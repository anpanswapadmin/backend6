import { NextFunction, Request, Response } from 'express';

import { User } from '../../models/user.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
	const account = req.query.account
	User.findOne({ where: { account } })
		.then((user) => res.json(user))
		.catch(next);
};
