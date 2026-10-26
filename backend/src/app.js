import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Import Routes
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import clubsRoutes from './modules/clubs/clubs.routes.js';
import recruitmentsRoutes from './modules/recruitments/recruitments.routes.js';
import applicationsRoutes from './modules/applications/applications.routes.js';
import membershipsRoutes from './modules/memberships/memberships.routes.js';
import eventsRoutes from './modules/events/events.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: [ENV.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:80'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Giới hạn tần suất request (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: ENV.RATE_LIMIT_MAX || 2000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test',
  message: { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.' }
});
app.use(limiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API v1 Routes
const apiV1 = express.Router();
apiV1.use('/auth', authRoutes);
apiV1.use('/users', usersRoutes);
apiV1.use('/', clubsRoutes);
apiV1.use('/', recruitmentsRoutes);
apiV1.use('/', applicationsRoutes);
apiV1.use('/', membershipsRoutes);
apiV1.use('/', eventsRoutes);
apiV1.use('/stats', statsRoutes);
apiV1.use('/admin', adminRoutes);

app.use('/api/v1', apiV1);

// Global Error Handler
app.use(errorHandler);

export default app;
