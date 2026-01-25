import express from  "express"
import cors from "cors"
import mongoose from "mongoose";
import dotenv from 'dotenv';
import axios from "axios";
dotenv.config();



const app=express();
app.use(cors());

app.use(express.json());
const port=5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Usermodel = mongoose.model("users", UserSchema);

app.post("/sign-in", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const user = await Usermodel.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User already exists, kindly login!" });
    }

    // Create a new user instance
    const newUser = new Usermodel({
      name,
      email,
      password, 
    });

    await newUser.save();

    res.status(201).json({ message: "Registration Successful!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/log-in', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await Usermodel.findOne({ name });
    if (!user || user.password !== password) { 
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ username: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




const recipeSchema = new mongoose.Schema({
    label: String,
    image: String,
    ingredientLines: [String],
    url: String,
   
});


const Recipe = mongoose.model('datas', recipeSchema);

const apiKey = process.env.EDAMAM_API_KEY;
const appId =  process.env.EDAMAM_APP_ID;

app.get('/fetch-recipes', async (req, res) => {
  const { ingredients } = req.query;
  console.log(`Ingredients received: ${ingredients}`);
  const query = encodeURIComponent(ingredients);
  const url = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${apiKey}`;

  try {
      const response = await axios.get(url);
      console.log('Edamam API response:', response.data);
      const recipes = response.data.hits.map(hit => ({
          label: hit.recipe.label,
          image: hit.recipe.image,
          ingredientLines: hit.recipe.ingredientLines,
          url: hit.recipe.url,
          
      }));

      await Recipe.insertMany(recipes);
      console.log('Recipes saved to DB:', recipes);
      res.json(recipes);
  } catch (error) {
// FULL detailed logs for Vercel console
console.error("========== RECIPE FETCH ERROR ==========");
console.error("Message:", error.message);
console.error("Status:", error.response?.status);
console.error("Data:", error.response?.data);
console.error("=======================================");


// send real error to frontend (not generic 500)
res.status(error.response?.status || 500).json({
error: error.response?.data || error.message
});
}
});


app.get('/saved-recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Error fetching saved recipes' });
    }
});





const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

const Message = mongoose.model('Message', messageSchema);


app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded



app.post('/submit', async (req, res) => {
  const { name, email, phone, message } = req.body;

  
  const newMessage = new Message({
    name,
    email,
    phone,
    message
  });

  try {
    
    await newMessage.save();
    res.status(200).send('Message received');
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).send('Error saving message');
  }
});

app.listen(port,()=>{
    console.log("Server listening at 5000 port");
})
