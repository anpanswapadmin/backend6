import { NextFunction, Request, Response } from 'express';

import { User2 } from '../../models/user.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
	// If a query string ?account=... is given, then filter results
	const whereClause =
		req.query && req.query.account
			? {
					where: { account: req.query.account },
			  }
			: undefined;

	return User2.findAll(whereClause)
		.then((users2: User2[]) => res.json(users2))
		.catch(next);
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	// AccessToken payload is in req.user2.payload, especially its `id` field
	// User2Id is the param in /users2/:user2Id
	// We only allow user accessing herself, i.e. require payload.id==user2Id
	if ((req as any).user2.payload.id !== +req.params.user2Id) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User2.findByPk(req.params.user2Id)
		.then((user2: User2 | null) => res.json(user2))
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
	User2.create(req.body)
		.then((user2: User2) => res.json(user2))
		.catch(next);

export const patch = (req: Request, res: Response, next: NextFunction) => {
	// Only allow to fetch current user
	if ((req as any).user2.payload.id !== +req.params.user2Id) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User2.findByPk(req.params.user2Id)
		.then((user2: User2 | null) => {
			if (!user2) {
				return user2;
			}

			Object.assign(user2, req.body);
			return user2.save();
		})
		.then((user2: User2 | null) => {
			return user2
				? res.json(user2)
				: res.status(401).send({
						error: `User with account ${req.params.user2Id} is not found in database`,
				  });
		})
		.catch(next);
};
