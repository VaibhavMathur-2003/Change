# 🩺 Personalized Healthcare Platform

A **Next.js**-powered personalized healthcare web application that generates AI-driven weekly fitness and wellness plans using **Groq LLM**, **MongoDB**, and **PostgreSQL**.

---

## 🚀 Features

- 🔐 Secure user registration and authentication
- 📋 Dynamic user profiling (age, weight, fitness level, goals, injuries, etc.)
- 🤖 AI-generated fitness/diet plans using **Groq LLM**
- 🗂️ Flexible NoSQL schema with **Mongoose**
- 🛠️ Extensible to other health routines (e.g. nutrition, mental health)

---

## 🧰 Tech Stack

| Technology    | Description                                 |
|---------------|---------------------------------------------|
| Next.js       | Full-stack React framework                  |
| MongoDB       | NoSQL for dynamic plan storage              |
| Groq LLM      | AI for generating personalized plans        |
| TypeScript    | Static typing and IDE support               |

---

---

## ⚙️ How It Works

The personalized plan is generated through a backend utility function:

```ts
generatePersonalizedPlan(req, {
  userModel: User,
  planModel: WeeklyPlan,
  itemModel: WorkoutItem,
  planType: "Workout",
  createItem: createWorkoutItem,
  generateUserPrompt: (profile, params) => `...`,
  systemPrompt: "You are a fitness AI...",
});
```
- Fetches user data from MongoDB
- Checks for existing plans
- Uses Groq API to generate new plans (if needed)
- Parses and saves plans + items in DB
- Returns plans to client

## Create a .env file in the project root:
```bash
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_mongodb_connection_string
```

