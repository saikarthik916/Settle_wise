from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pathlib import Path
import json, uvicorn

app = FastAPI(title="Settle Wise Backend", version="1.0")
DATA_JSON = Path("data_json")
DATA_DIR = Path("data")

# ------------------ CORS ------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Helpers ------------------
def read_json_file(rel_path: str):
    path = DATA_JSON / rel_path
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"file not found: {rel_path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def safe_name(s: str):
    return "".join(c for c in s if c.isalnum() or c in (" ", "-", "_")).strip().replace(" ", "_").lower()

# ------------------ API ------------------

@app.get("/areas")
def get_areas():
    return read_json_file("localities.json")

@app.get("/data/city_averages")
def get_city_averages():
    return read_json_file("city_averages.json")

@app.get("/data/price_vs_aqi")
def get_price_vs_aqi():
    return read_json_file("price_vs_aqi.json")

@app.get("/data/aqi_vs_crime")
def get_aqi_vs_crime():
    return read_json_file("aqi_vs_crime.json")

@app.get("/data/housing")
def get_housing(address: str):
    s = safe_name(address)
    json_path = DATA_JSON / f"housing_by_area/{s}.json"
    if json_path.exists():
        return json.loads(json_path.read_text(encoding="utf-8"))
    raise HTTPException(status_code=404, detail=f"Housing data for '{address}' not found.")


@app.get("/data/others")
def get_others(address: str):
    s = safe_name(address)
    for p in [f"others_by_area/{s}.json", f"{address}.json"]:
        if (DATA_JSON / p).exists():
            return read_json_file(p)
    raise HTTPException(status_code=404, detail=f"Others data for '{address}' not found.")

@app.get("/data/restaurants")
def get_restaurants(address: str):
    s = safe_name(address)
    for p in [f"restaurants_by_area/{s}.json", f"{address}.json"]:
        if (DATA_JSON / p).exists():
            return read_json_file(p)
    raise HTTPException(status_code=404, detail=f"Restaurant data for '{address}' not found.")

@app.get("/summary/{address}")
def get_summary(address: str):
    s = safe_name(address)
    data = {}
    for folder, key in [("housing_by_area", "housing"), ("others_by_area", "others"), ("restaurants_by_area", "restaurants")]:
        p = DATA_JSON / folder / f"{s}.json"
        if p.exists():
            data[key] = read_json_file(f"{folder}/{s}.json")
    if not data:
        raise HTTPException(status_code=404, detail=f"No summary data for '{address}'")
    return data

@app.get("/datasets/{file_name}")
def download_dataset(file_name: str):
    allowed = {"Housing.csv", "Others.csv", "Restaurants.csv"}
    if file_name not in allowed:
        raise HTTPException(status_code=403, detail="Access denied")
    file_path = DATA_DIR / file_name
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename=file_name, media_type="text/csv")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
