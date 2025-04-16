// server.js
import app from "./app.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON");
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next(err);
});

// Final error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
