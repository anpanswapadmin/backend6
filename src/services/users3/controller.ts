import {sequelize} from '../../db';
import { NextFunction, Request, Response } from 'express';
import { User3 } from '../../models/user.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
	// If a query string ?account=... is given, then filter results
	const whereClause =
		req.query && req.query.account
			? {
					where: { account: req.query.account },
			  }
			: undefined;

	return User3.findAll(whereClause)
		.then((users3: User3[]) => res.json(users3))
		.catch(next);
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	// AccessToken payload is in req.user3.payload, especially its `id` field
	// User3Id is the param in /users2/:user3Id
	// We only allow user accessing herself, i.e. require payload.id==user3Id
	if ((req as any).user3.payload.id !== +req.params.user3Id) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User3.findByPk(req.params.user3Id)
		.then((user3: User3 | null) => res.json(user3))
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
	User3.create(req.body)
		.then((user3: User3) => res.json(user3))
		.catch(next);

export const patch = (req: Request, res: Response, next: NextFunction) => {
	// Only allow to fetch current user
	if ((req as any).user3.payload.id !== +req.params.user3Id) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User3.findByPk(req.params.user3Id)
		.then((user3: User3 | null) => {
			if (!user3) {
				return user3;
			}

			Object.assign(user3, req.body);
			return user3.save();
		})
		.then((user3: User3 | null) => {
			return user3
				? res.json(user3)
				: res.status(401).send({
						error: `User with account ${req.params.user3Id} is not found in database`,
				  });
		})
		.catch(next);
};

export const deleteDatabase = (req: Request, res: Response, next: NextFunction) => {
	const account = req.query.account
	const query = `DELETE FROM users WHERE account = "${account}"`
	sequelize.query(query)
	.catch(next);
}