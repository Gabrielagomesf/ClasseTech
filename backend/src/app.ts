import express from 'express';
import {errorHandler} from './middleware/errorHandler';
import {applySecurity} from './middleware/security';
import {routes} from './routes';

export function createApp() {
  const app = express();

  applySecurity(app);
  app.use(express.json({limit: '200kb'}));
  app.use('/api', routes);
  app.use(errorHandler);

  return app;
}
