# 🏡 SettleWise

**SettleWise** is a smart neighborhood intelligence platform that helps users evaluate and compare localities using data-driven insights. By combining housing prices, air quality, safety metrics, restaurants, and local amenities, SettleWise empowers users to make informed decisions when choosing where to live.


## 📖 Overview

Finding the right neighborhood involves more than just comparing house prices. SettleWise aggregates multiple factors that influence quality of life and presents them through an intuitive dashboard.

Whether you're relocating, investing in real estate, or simply exploring different areas, SettleWise provides a comprehensive view of each locality to support better decision-making.

## ✨ Features

- 📍 Compare neighborhoods and localities
- 🏠 Analyze housing prices across areas
- 🌿 View Air Quality Index (AQI) metrics
- 🛡️ Evaluate crime and safety statistics
- 🍽️ Explore restaurants and lifestyle amenities
- 📊 Interactive charts and visual analytics
- 📈 Compare city averages with locality data
- 📥 Download datasets for further analysis
- ⚡ Fast and responsive user experience

---

## 🏗️ Architecture

```text
┌─────────────────┐
│    Frontend     │
│      React      │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│     FastAPI     │
│    Backend      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Data Layer    │
│ Housing • AQI   │
│ Crime • Dining  │
└─────────────────┘

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Radix UI

### Backend
- FastAPI
- Python
- Uvicorn

### Data Processing
- Pandas
- CSV/JSON datasets

---

## 📂 Project Structure

```text
SettleWise/
│
├── backend/
│   ├── data/
│   ├── data_json/
│   ├── main.py
│   ├── requirements.txt
│   └── static/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/SettleWise.git
cd SettleWise
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python main.py
```

Backend will run at:

```text
http://localhost:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

| Endpoint | Description |
|-----------|-------------|
| `/areas` | Available neighborhoods |
| `/summary/{address}` | Complete area summary |
| `/data/housing` | Housing information |
| `/data/restaurants` | Restaurant details |
| `/data/others` | Additional neighborhood metrics |
| `/data/city_averages` | City-wide averages |
| `/data/price_vs_aqi` | Housing price vs AQI analysis |
| `/data/aqi_vs_crime` | AQI vs crime analysis |
| `/datasets/{file}` | Download datasets |

---

## 📊 Insights Provided

### Housing Analysis
- Property pricing trends
- Locality comparisons
- Affordability insights

### Environmental Factors
- Air quality measurements
- AQI impact analysis

### Safety Metrics
- Crime statistics
- Neighborhood safety evaluation

### Lifestyle Analysis
- Restaurant availability
- Local amenities
- Quality-of-life indicators

---

## 🎯 Use Cases

- Home buyers searching for ideal neighborhoods
- Renters comparing localities
- Real estate investors
- Urban planners and researchers
- Smart city analytics projects

---

## 🔮 Future Enhancements

- AI-powered neighborhood recommendations
- Interactive map visualizations
- Real-time property data integration
- Commute and transportation scoring
- Personalized ranking engine
- Predictive housing market analytics

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

Developed with the goal of making neighborhood discovery and housing decisions more transparent through data-driven insights.

### ⭐ If you find this project useful, consider giving it a star!
