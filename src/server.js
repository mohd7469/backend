import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import routes from './routes/index.js';
import { errorHandler } from './middlewares/index.js';
import { env } from './config/env.js';

const app = express();

// security middlewares
app.use(helmet());

app.use(cors());
app.use(express.json());

// main entrance
app.use('/api/v1', routes);

// catch all
app.get('/', (req, res) => res.send('API is running'));

// error middleware should be last
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
