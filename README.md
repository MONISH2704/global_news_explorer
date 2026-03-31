<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Global News Explorer</title>
</head>
<body>

  <h1>🌍 Global News Explorer</h1>

  <p>
    Global News Explorer is a full-stack web application that allows users to search for any
    <b>country or city</b> and get the <b>latest news articles</b> in real time from multiple sources.
  </p>

  <hr>

  <h2>🚀 Features</h2>
  <ul>
    <li>🔍 Search news by city or country</li>
    <li>📰 Latest news sorted by published date</li>
    <li>🌐 Multiple news sources (GNews + NewsAPI)</li>
    <li>⚡ API fallback mechanism</li>
    <li>🧠 AI-based summarization (HuggingFace)</li>
    <li>💾 Caching using MongoDB (10 minutes)</li>
    <li>📱 Responsive UI (mobile + desktop)</li>
    <li>🌙 Dark mode support</li>
    <li>🔖 Bookmark articles</li>
  </ul>

  <hr>

  <h2>🧱 Tech Stack</h2>
  <ul>
    <li><b>Frontend:</b> React.js, Tailwind CSS</li>
    <li><b>Backend:</b> Node.js, Express</li>
    <li><b>Database:</b> MongoDB Atlas</li>
    <li><b>APIs:</b> GNews API, NewsAPI, HuggingFace</li>
    <li><b>Deployment:</b> Vercel (Frontend), Render (Backend)</li>
  </ul>

  <hr>

  <h2>📂 Project Structure</h2>

  <pre>
server/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── models/
 ├── config/
 └── server.js

client/
 ├── components/
 ├── pages/
 ├── services/
 └── App.js
  </pre>

  <hr>

  <h2>⚙️ Installation & Setup</h2>

  <h3>1. Clone Repository</h3>
  <pre>git clone https://github.com/your-username/global-news-explorer.git</pre>

  <h3>2. Backend Setup</h3>
  <pre>
cd server
npm install
  </pre>

  <h3>Create .env file in server:</h3>
  <pre>
GNEWS_API_KEY=your_key
NEWS_API_KEY=your_key
HF_API_KEY=your_key
MONGO_URI=your_mongodb_uri
  </pre>

  <h3>Run Backend</h3>
  <pre>node server.js</pre>

  <h3>3. Frontend Setup</h3>
  <pre>
cd client
npm install
npm run dev
  </pre>

  <hr>

  <h2>🌐 Deployment</h2>
  <ul>
    <li><b>Frontend:</b> Vercel</li>
    <li><b>Backend:</b> Render</li>
    <li><b>Database:</b> MongoDB Atlas</li>
  </ul>

  <hr>

  <h2>⚡ API Flow</h2>
  <ol>
    <li>User enters location</li>
    <li>Backend checks MongoDB cache</li>
    <li>If cached → return data</li>
    <li>If not → call GNews API</li>
    <li>If no results → fallback to NewsAPI</li>
    <li>Store result in MongoDB</li>
    <li>Send response to frontend</li>
  </ol>

  <hr>

  <h2>🧠 Future Enhancements</h2>
  <ul>
    <li>📊 Trending news analytics</li>
    <li>🌍 Multi-language support</li>
    <li>🔔 Real-time notifications</li>
    <li>🗺️ Map-based news search</li>
  </ul>

  <hr>

  <h2>👨‍💻 Author</h2>
  <p><b>Monish Gowda</b></p>

  <hr>

  <h2>⭐ Acknowledgements</h2>
  <ul>
    <li>GNews API</li>
    <li>NewsAPI</li>
    <li>HuggingFace</li>
    <li>MongoDB Atlas</li>
  </ul>

</body>
</html>
