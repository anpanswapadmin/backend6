import './db';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const path = require("path");
import {Sequelize} from 'sequelize';
import session from 'express-session';
var SequelizeStore = require("connect-session-sequelize")(session.Store);

import { services } from './services';

const sequelize = new Sequelize({
	database: "qfwyzfqo_anpanswap",
	username: "qfwyzfqo_anpan",
	password: "bsd&2YqQ]8%b",
	host: "localhost",
	port: 3306,
	dialect: "mysql",
	storage: "./session.mysql",
	dialectOptions: {
	},
  });

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(
	session({
	  secret: "keyboard cat",
	  store: new SequelizeStore({
		db: sequelize,
	  }),
	  saveUninitialized: true,
	  resave: true, // we support the touch method so per the express-session docs this should be set to false
	  proxy: true, // if you do SSL outside of node.
	})
  );

app.get('/ref/:refname', function (req, res) {
	req.session.cookie.path = req.params.refname;
	res.redirect('/');
   })
  
sequelize.sync();

// Mount REST on /api
app.use('/api', services);


const port = process.env.PORT || 8000;

app.listen(port, () =>
	console.log(`Express app listening on localhost:${port}`)
);
