import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


dotenv.config();

const app = express();
connectDB();

// 1. CORS (must be first, before any route)
const corsOptions = {
  origin: (origin, callback) => {
    const allowed =
      !origin || // Postman, server-to-server, browser address bar
      origin === "http://localhost:5173" ||
      origin === process.env.FRONTEND_URL || // main frontend domain from env
      /^https:\/\/event-booking-frontend.*\.vercel\.app$/.test(origin); // all Vercel frontend URLs

    // Pass false (not an Error) so the response stays clean
    callback(null, allowed);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// 2. Body parser
app.use(express.json());

// 4. Routes
app.get("/", (req, res) => {
  res.send("Utsav API is running");
});

app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// 5. Error handlers (must be LAST)
app.use(notFound);
app.use(errorHandler);

export default app;

// Local development only (Vercel does not use app.listen)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}