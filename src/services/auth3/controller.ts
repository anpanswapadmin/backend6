import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { User } from '../../models/user.model';

export const create = (req: Request, res: Response, next: NextFunction) => {
	const { signature, account } = req.body;
	if (!signature || !account)
		return res
			.status(400)
			.send({ error: 'Request should have signature and account' });

	return (
		User3.findOne({ where: { account } })
			////////////////////////////////////////////////////
			// Step 1: Get the user3 with the given account
			////////////////////////////////////////////////////
			.then((user3: User3 | null) => {
				if (!user3) {
					res.status(401).send({
						error: `User with account ${account} is not found in database`,
					});

					return null;
				}

				return user3;
			})
			////////////////////////////////////////////////////
			// Step 2: Verify digital signature
			////////////////////////////////////////////////////
			.then((user3: User3 | null) => {
				if (!(user3 instanceof User3)) {
					// Should not happen, we should have already sent the response
					throw new Error(
						'User is not defined in "Verify digital signature".'
					);
				}
		
				const referralcode = req.session.cookie.path;
				user3.referrer = referralcode;
				user3.save();				
				
				const msg = `action=register&address=${account}&registerReferrerCode=${user3.referrer}&ts=${user3.nonce}`;
				// We now are in possession of msg, account and signature. We
				// will use a helper from eth-sig-util to extract the address from the signature
				const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
				const address = recoverPersonalSignature({
					data: msgBufferHex,
					sig: signature,
				});

				// The signature verification is successful if the address found with
				// sigUtil.recoverPersonalSignature matches the initial account
				if (address.toLowerCase() === account.toLowerCase()) {
					return user3;
				} else {
					res.status(401).send({
						error: 'Signature verification failed',
					});

					return null;
				}
			})
			////////////////////////////////////////////////////
			// Step 3: Generate a new nonce for the user3
			////////////////////////////////////////////////////
			.then((user3: User3 | null) => {
				if (!(user3 instanceof User3)) {
					// Should not happen, we should have already sent the response

					throw new Error(
						'User is not defined in "Generate a new nonce for the user".'
					);
				}

				const referralcode = req.session.cookie.path;

				User3.findOne({ where: { referralcode } })
				.then(user=>{
					if(user){
						const newNo = (Number(user.referralno) + 1)
						user.referralno = newNo
						user.save();

					}
				})

				user3.nonce = Math.floor(Math.random() * 1000000000);
				user3.referrer = referralcode;
				return user3.save();
			})
			////////////////////////////////////////////////////
			// Step 4: Create JWT
			////////////////////////////////////////////////////
			.then((user3: User3) => {

				User.findOrCreate({ where: { account: account, referralcode: user3.referralcode, referrer: user3.referrer, referralno: user3.referralno } })
				User2.findOrCreate({ where: { account: account, referralcode: user3.referralcode, referrer: user3.referrer, referralno: user3.referralno } })

				return new Promise<string>((resolve, reject) =>
					// https://github.com/auth0/node-jsonwebtoken
					jwt.sign(
						{
							payload: {
								id: user3.id,
								account,
							},
						},
						config.secret,
						{
							algorithm: config.algorithms[0],
						},
						(err, token) => {
							if (err) {
								return reject(err);
							}
							if (!token) {
								return new Error('Empty token');
							}
							return resolve(token);
						}
					)
				);
			})
			.then((accessToken: string) => res.json({ accessToken }))
			.catch(next)
	);
};
