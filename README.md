# ⚙️ RecipeHub – Backend API Server

![Node.js](https://img.shields.io/badge/Node.js-Runtime-green)
![Express](https://img.shields.io/badge/Express-Framework-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-darkgreen)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

A scalable **RESTful API backend** that powers the RecipeHub application.  
Built using **Node.js, Express, and MongoDB**, this server handles recipe search requests, processes data, and sends results to the frontend in real time.

Deployed as a **serverless backend on Vercel**.

---

## 🚀 Live API
👉 https://dharunrecipehub-server.vercel.app/

---

## 📖 About the Project

The backend is responsible for:
- Handling API requests from the frontend
- Fetching recipe data
- Processing ingredient-based searches
- Managing database operations
- Sending fast JSON responses

This project demonstrates:
- REST API development
- MongoDB integration
- Server-side routing
- Environment configuration
- Backend deployment on Vercel

---

## ✨ Features
- RESTful API architecture
- Ingredient-based recipe search
- Fast JSON responses
- MongoDB database integration
- Clean modular structure
- Environment variables support
- Serverless deployment

---

## 🛠 Tech Stack

| Technology | Purpose |
|-------------|------------|
| Node.js | Runtime environment |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | ODM |
| dotenv | Environment config |
| Vercel | Deployment |

---

## ⚙️ Run Locally

### Clone repository
```bash
git clone https://github.com/DharunKumar-V/recipehub-server
cd recipehub-server
```

### Install dependencies
```bash
npm install
```

### Create `.env` file
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
API_KEY=your_recipe_api_key
```

### Start server
```bash
npm start
```

Server runs at:
```
http://localhost:5000
```

---

## 📡 API Endpoints

### 🔍 Fetch Recipes
```http
GET /fetch-recipes?ingredients=tomato,onion
```

### Example Response
```json
{
  "recipes": [
    {
      "title": "Tomato Soup",
      "ingredients": ["Tomato", "Onion"],
      "instructions": "Boil and blend...",
      "image": "image_url"
    }
  ]
}
```

---

## 📂 Project Structure

```text
recipehub-server/
 ├── routes/
 ├── controllers/
 ├── models/
 ├── config/
 ├── server.js
 ├── package.json
 └── README.md
```

---

## 🌐 Deployment (Vercel)

1. Push repo to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## 📜 License
This project is licensed under the MIT License.

---

## 👨‍💻 Author
**Dharun Kumar V**

GitHub: https://github.com/DharunKumar-V  
LinkedIn: https://www.linkedin.com/in/dharunkumar100/

⭐ If you found this project helpful, consider giving it a star!
