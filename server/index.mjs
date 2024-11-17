// imports
import express from 'express'; // express framework
import cors from 'cors'; // CORS middleware
import initRoutes from './app/routes/index.mjs';

// init express
const app = new express();
const port = 3001 || process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
// import routes
initRoutes(app)

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});