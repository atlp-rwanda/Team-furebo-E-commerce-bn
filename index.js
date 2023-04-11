import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import routes from './src/routes/routesCalls.routes';
import swaggerDocs from './src/swagger';
import schedulingJob from './src/jobs/schedulingTask';

const app = express();
require('./src/services/auth');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cors({ origin: 'http://localhost:3000/google/callback' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/home', (req, res) => {
  res.status(200).send('WELCOME!');
});
app.use(routes);
schedulingJob();
const port = process.env.PORT || 3000;
app.listen(port, () => {});

export default app;
