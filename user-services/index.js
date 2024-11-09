import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import DepartmentRoute from "./routes/DepartmentRoute.js"; 
import GroupsRoute from './routes/GroupRoute.js';

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

(async()=>{
    await db.sync();
})();

app.use(
    session({
      secret: process.env.SESS_SECRET || 'your-secret-key', // Ensure this is set to a strong, unique string
      resave: false,              // Optional: set to false to avoid resaving unchanged sessions
      saveUninitialized: true,    // Optional: set to true to save new sessions that are uninitialized
      cookie: { secure: false }   // Set to true if you are using HTTPS
    })
  );

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(DepartmentRoute);
app.use(GroupsRoute);

// store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});
