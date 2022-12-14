import { INTEGER, Sequelize, STRING } from 'sequelize';
import ShortUniqueId from 'short-unique-id';
import { User } from './models';

const sequelize = new Sequelize({
	database: "qfwyzfqo_anpanswap",
	username: "qfwyzfqo_anpan",
	password: "bsd&2YqQ]8%b",
	host: "localhost",
	port: 3306,
	dialect: "mysql",
	dialectOptions: {
	},
  });

//Instantiate
const uid = new ShortUniqueId({ length: 20 });

// Init all models
User.init(
	{
		nonce: {
			allowNull: false,
			type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
			defaultValue: (): number => Math.floor(Math.random() * 1000000000), // Initialize with a random nonce
		},
		account: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		referralcode: {
			allowNull: false,
			type: STRING,
			unique: true,
			defaultValue: (): string => uid(),
		},
		referrer: {
			type: STRING,
		},
		referralno: {
			type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
		},
	},
	{
		modelName: 'user',
		sequelize, // This bit is important
		timestamps: false,
	}
);

// Create new tables
sequelize.sync();

export { sequelize };
