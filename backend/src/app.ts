import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files for generated certificates and templates
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/generated', express.static(path.join(__dirname, '../generated')));

import dashboardRoutes from './routes/dashboardRoutes';
import emailRoutes from './routes/emailRoutes';

// Routes will be added here
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/events', emailRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
