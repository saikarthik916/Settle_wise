// Mock data for Settle Wise Dashboard

export const areas = [
  { id: 1, name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
  { id: 2, name: "Dwarka", lat: 28.5921, lng: 77.0460 },
  { id: 3, name: "Gurgaon Sector 29", lat: 28.4646, lng: 77.0299 },
  { id: 4, name: "Noida Sector 62", lat: 28.6271, lng: 77.3654 },
  { id: 5, name: "Saket", lat: 28.5244, lng: 77.2066 },
  { id: 6, name: "Hauz Khas", lat: 28.5494, lng: 77.2001 },
  { id: 7, name: "Vasant Kunj", lat: 28.5170, lng: 77.1581 },
  { id: 8, name: "Cyber City", lat: 28.4950, lng: 77.0889 },
  { id: 9, name: "Greater Kailash", lat: 28.5494, lng: 77.2428 },
  { id: 10, name: "Nehru Place", lat: 28.5494, lng: 77.2504 },
];

export const areaSummaries = {
  1: {
    id: 1,
    name: "Connaught Place",
    medianPrice: 18500,
    aqi: 178,
    crimeIndex: 42,
    transitScore: 95,
    restaurantCount: 347,
    population: 12500,
  },
  2: {
    id: 2,
    name: "Dwarka",
    medianPrice: 12000,
    aqi: 165,
    crimeIndex: 28,
    transitScore: 78,
    restaurantCount: 189,
    population: 85000,
  },
  3: {
    id: 3,
    name: "Gurgaon Sector 29",
    medianPrice: 22000,
    aqi: 192,
    crimeIndex: 35,
    transitScore: 68,
    restaurantCount: 412,
    population: 45000,
  },
  4: {
    id: 4,
    name: "Noida Sector 62",
    medianPrice: 14500,
    aqi: 155,
    crimeIndex: 31,
    transitScore: 72,
    restaurantCount: 256,
    population: 62000,
  },
  5: {
    id: 5,
    name: "Saket",
    medianPrice: 19500,
    aqi: 172,
    crimeIndex: 38,
    transitScore: 82,
    restaurantCount: 298,
    population: 38000,
  },
  6: {
    id: 6,
    name: "Hauz Khas",
    medianPrice: 20500,
    aqi: 168,
    crimeIndex: 36,
    transitScore: 85,
    restaurantCount: 324,
    population: 42000,
  },
  7: {
    id: 7,
    name: "Vasant Kunj",
    medianPrice: 17500,
    aqi: 162,
    crimeIndex: 30,
    transitScore: 76,
    restaurantCount: 215,
    population: 55000,
  },
  8: {
    id: 8,
    name: "Cyber City",
    medianPrice: 23000,
    aqi: 188,
    crimeIndex: 33,
    transitScore: 81,
    restaurantCount: 445,
    population: 52000,
  },
  9: {
    id: 9,
    name: "Greater Kailash",
    medianPrice: 21500,
    aqi: 175,
    crimeIndex: 34,
    transitScore: 80,
    restaurantCount: 289,
    population: 48000,
  },
  10: {
    id: 10,
    name: "Nehru Place",
    medianPrice: 15500,
    aqi: 180,
    crimeIndex: 40,
    transitScore: 88,
    restaurantCount: 267,
    population: 35000,
  },
};

export const priceDistribution = [
  { range: "5k-10k", count: 42, frequency: 0.08 },
  { range: "10k-15k", count: 128, frequency: 0.25 },
  { range: "15k-20k", count: 186, frequency: 0.35 },
  { range: "20k-25k", count: 95, frequency: 0.18 },
  { range: "25k-30k", count: 48, frequency: 0.09 },
  { range: "30k+", count: 28, frequency: 0.05 },
];

export const priceByBedrooms = [
  { bedrooms: "1 BHK", min: 8000, q1: 11000, median: 13500, q3: 16000, max: 19000 },
  { bedrooms: "2 BHK", min: 12000, q1: 16000, median: 19500, q3: 23000, max: 28000 },
  { bedrooms: "3 BHK", min: 18000, q1: 24000, median: 29000, q3: 35000, max: 42000 },
  { bedrooms: "4+ BHK", min: 28000, q1: 38000, median: 48000, q3: 60000, max: 85000 },
];

export const priceVsArea = Array.from({ length: 150 }, (_, i) => ({
  area: 400 + Math.random() * 2100,
  price: 8000 + Math.random() * 42000,
  bedrooms: Math.floor(Math.random() * 4) + 1,
}));

export const crimeData = [
  { category: "Theft", count: 24, rate: 3.2 },
  { category: "Burglary", count: 12, rate: 1.6 },
  { category: "Vehicle Theft", count: 18, rate: 2.4 },
  { category: "Assault", count: 8, rate: 1.1 },
  { category: "Vandalism", count: 15, rate: 2.0 },
];

export const transitDistribution = [
  { distance: "0-0.5km", count: 45, percentage: 22 },
  { distance: "0.5-1km", count: 68, percentage: 33 },
  { distance: "1-2km", count: 52, percentage: 25 },
  { distance: "2-3km", count: 28, percentage: 14 },
  { distance: "3km+", count: 12, percentage: 6 },
];

export const nearbyMetros = [
  { name: "Rajiv Chowk", line: "Yellow & Blue Line", distance: 0.3 },
  { name: "Patel Chowk", line: "Yellow Line", distance: 0.8 },
  { name: "Central Secretariat", line: "Yellow & Violet Line", distance: 1.2 },
  { name: "Janpath", line: "Blue Line", distance: 0.6 },
];

export const restaurantRatings = [
  { rating: "1-2", count: 8 },
  { rating: "2-3", count: 24 },
  { rating: "3-4", count: 142 },
  { rating: "4-5", count: 173 },
];

export const topRestaurants = [
  { id: 1, name: "United Coffee House", cuisine: "Continental", rating: 4.5, priceFor2: 2500 },
  { id: 2, name: "Wenger's", cuisine: "Bakery", rating: 4.3, priceFor2: 800 },
  { id: 3, name: "Kwality", cuisine: "North Indian", rating: 4.2, priceFor2: 1200 },
  { id: 4, name: "Haldiram's", cuisine: "Indian", rating: 4.1, priceFor2: 600 },
  { id: 5, name: "Cafe Turtle", cuisine: "Cafe", rating: 4.4, priceFor2: 900 },
  { id: 6, name: "Rajdhani", cuisine: "Gujarati Thali", rating: 4.3, priceFor2: 700 },
];

export const aqiTimeSeries = [
  { month: "Jan", aqi: 245 },
  { month: "Feb", aqi: 198 },
  { month: "Mar", aqi: 156 },
  { month: "Apr", aqi: 142 },
  { month: "May", aqi: 165 },
  { month: "Jun", aqi: 188 },
  { month: "Jul", aqi: 152 },
  { month: "Aug", aqi: 145 },
  { month: "Sep", aqi: 168 },
  { month: "Oct", aqi: 198 },
  { month: "Nov", aqi: 278 },
  { month: "Dec", aqi: 312 },
];

export const mockGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Connaught Place", density: 85 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.2067, 28.6315],
            [77.2267, 28.6315],
            [77.2267, 28.6415],
            [77.2067, 28.6415],
            [77.2067, 28.6315],
          ],
        ],
      },
    },
  ],
};

export const dataSources = [
  {
    name: "99acres.com",
    type: "Real Estate Listings",
    lastUpdated: "2025-10-01",
    recordCount: 45230,
  },
  {
    name: "MagicBricks.com",
    type: "Real Estate Listings",
    lastUpdated: "2025-10-01",
    recordCount: 38940,
  },
  {
    name: "Delhi Police Open Data",
    type: "Crime Statistics",
    lastUpdated: "2025-09-15",
    recordCount: 12480,
  },
  {
    name: "DMRC Official",
    type: "Metro Station Data",
    lastUpdated: "2025-08-01",
    recordCount: 285,
  },
  {
    name: "CPCB AQI Portal",
    type: "Air Quality Index",
    lastUpdated: "2025-10-08",
    recordCount: 2920,
  },
  {
    name: "Zomato API",
    type: "Restaurant Data",
    lastUpdated: "2025-10-05",
    recordCount: 8456,
  },
];

// Sample GeoJSON for developer handoff - polygon layer for area boundaries
export const sampleGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "areaId": 1,
        "name": "Connaught Place",
        "medianPrice": 18500,
        "aqi": 178,
        "crimeIndex": 42,
        "transitScore": 95
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [77.2142, 28.6330],
            [77.2192, 28.6330],
            [77.2192, 28.6300],
            [77.2142, 28.6300],
            [77.2142, 28.6330]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "areaId": 2,
        "name": "Dwarka",
        "medianPrice": 12000,
        "aqi": 165,
        "crimeIndex": 28,
        "transitScore": 78
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [77.0435, 28.5936],
            [77.0485, 28.5936],
            [77.0485, 28.5906],
            [77.0435, 28.5906],
            [77.0435, 28.5936]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "areaId": 3,
        "name": "Gurgaon Sector 29",
        "medianPrice": 15500,
        "aqi": 182,
        "crimeIndex": 35,
        "transitScore": 72
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [77.0274, 28.4661],
            [77.0324, 28.4661],
            [77.0324, 28.4631],
            [77.0274, 28.4631],
            [77.0274, 28.4661]
          ]
        ]
      }
    }
  ]
};

// Sample CSV schema for data export
export const csvSchema = {
  "filename": "settlewise_area_data.csv",
  "description": "Exported area comparison data",
  "columns": [
    { "name": "area_id", "type": "integer", "description": "Unique area identifier" },
    { "name": "area_name", "type": "string", "description": "Area/locality name" },
    { "name": "median_rent_2bhk", "type": "float", "description": "Median monthly rent for 2 BHK in INR" },
    { "name": "aqi", "type": "integer", "description": "Air Quality Index (0-500 scale)" },
    { "name": "crime_index", "type": "float", "description": "Safety index (0-100, lower is safer)" },
    { "name": "transit_score", "type": "integer", "description": "Public transport accessibility (0-100)" },
    { "name": "restaurant_count", "type": "integer", "description": "Number of restaurants within 2km" },
    { "name": "population", "type": "integer", "description": "Estimated population" },
    { "name": "latitude", "type": "float", "description": "Geographic latitude" },
    { "name": "longitude", "type": "float", "description": "Geographic longitude" }
  ],
  "sampleRow": "1,Connaught Place,18500,178,42,95,347,12500,28.6315,77.2167"
};
