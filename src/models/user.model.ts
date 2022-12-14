import { Model } from 'sequelize';

export class User extends Model {
	public id!: number; // Note that the `null assertion` `!` is required in strict mode.
	public nonce!: number;
	public account!: string;
	public referralcode!: string; // for nullable fields
	public referrer?: string;
	public referralno?: number;
}
