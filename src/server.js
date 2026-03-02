import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';
import { env } from './config/env.js';

const app = express();

// security middlewares
app.use(helmet());

app.use(cors());
app.use(express.json());

// server logger
app.use(morgan('dev'));

// main entrance
app.use('/api/v1', routes);

// catch all
app.get('/', (req, res) => res.send('API server is running..'));

// handle undefined routes (404)
app.use('*', (req, res, next) => next(errors.notFound(`Route "${req.originalUrl}" not found`)));

// error middleware should be last
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`\nenv: ${env.APP_ENV}\nserver running on port ${env.PORT}\n`));
