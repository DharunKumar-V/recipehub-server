import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

/* ================= Middleware ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ================= MongoDB (Serverless Safe) ================= */
/* prevents multiple connections on Vercel */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;

  console.log("✅ MongoDB Connected");
};


/* ================= Schemas ================= */

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const RecipeSchema = new mongoose.Schema({
  label: String,
  image: String,
  ingredientLines: [String],
  url: String,
});

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});


/* prevent model overwrite in serverless */
const User = mongoose.models.users || mongoose.model("users", UserSchema);
const Recipe = mongoose.models.datas || mongoose.model("datas", RecipeSchema);
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);


/* ================= Routes ================= */

/* Health check */
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});


/* ---------- Register ---------- */
app.post("/sign-in", async (req, res) => {
  try {
    await connectDB();

    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "User already exists" });

    await User.create({ name, email, password });

    res.status(201).json({ message: "Registration Successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* ---------- Login ---------- */
app.post("/log-in", async (req, res) => {
  try {
    await connectDB();

    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user || user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ username: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------- Fetch Recipes (Edamam) ---------- */
app.get("/fetch-recipes", async (req, res) => {
  try {
    await connectDB();

    const { ingredients } = req.query;

    const url = `https://api.edamam.com/search?q=${encodeURIComponent(
      ingredients
    )}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`;

    const response = await axios.get(url);

    const recipes = response.data.hits.map(hit => ({
      label: hit.recipe.label,
      image: hit.recipe.image,
      ingredientLines: hit.recipe.ingredientLines,
      url: hit.recipe.url,
    }));

    await Recipe.insertMany(recipes);

    res.json(recipes);

  } catch (error) {
    console.error("========== RECIPE ERROR ==========");
    console.error(error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});


/* ---------- Saved Recipes ---------- */
app.get("/saved-recipes", async (req, res) => {
  try {
    await connectDB();

    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ---------- Contact Form ---------- */
app.post("/submit", async (req, res) => {
  try {
    await connectDB();

    await Message.create(req.body);

    res.json({ message: "Message saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ================= IMPORTANT ================= */
/* NO app.listen() for Vercel */

export default app;
