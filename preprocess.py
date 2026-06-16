import os
import json
import math
import argparse
from pathlib import Path
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# ===================== CONFIG =====================
DATA_DIR = Path("data")
OUT_DIR = Path("data_json")
HIST_BINS = 12  # number of bins for histograms

# ===================== HELPERS =====================

def json_safe(obj):
    """Converts numpy and pandas data types to native Python types for JSON serialization."""
    if isinstance(obj, (np.integer, np.int64, np.int32)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32)):
        return float(obj)
    elif isinstance(obj, (np.ndarray, list, tuple)):
        return [json_safe(x) for x in obj]
    elif isinstance(obj, dict):
        return {k: json_safe(v) for k, v in obj.items()}
    else:
        return obj


def safe_name(s: str) -> str:
    """Sanitizes locality/address string for filenames."""
    return "".join(c for c in s if c.isalnum() or c in (" ", "-", "_")).strip().replace(" ", "_").lower()


def ensure_dirs():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "housing_by_area").mkdir(exist_ok=True)
    (OUT_DIR / "others_by_area").mkdir(exist_ok=True)
    (OUT_DIR / "restaurants_by_area").mkdir(exist_ok=True)


def histogram_bins(values: List[float], bins: int = HIST_BINS) -> List[Dict[str, Any]]:
    if len(values) == 0:
        return []
    counts, edges = np.histogram(values, bins=bins)
    bin_list = []
    for i in range(len(counts)):
        bin_list.append({
            "bin_start": float(edges[i]),
            "bin_end": float(edges[i + 1]),
            "count": int(counts[i]),
            "bin_center": float((edges[i] + edges[i + 1]) / 2),
        })
    return bin_list


def quartiles(values: List[float]) -> Dict[str, float]:
    if len(values) == 0:
        return {"min": None, "q1": None, "median": None, "q3": None, "max": None}
    arr = np.array(values)
    return {
        "min": float(np.min(arr)),
        "q1": float(np.percentile(arr, 25)),
        "median": float(np.percentile(arr, 50)),
        "q3": float(np.percentile(arr, 75)),
        "max": float(np.max(arr)),
    }


def regression_coeffs(x_vals: List[float], y_vals: List[float]):
    try:
        if len(x_vals) < 2:
            return None
        m, b = np.polyfit(x_vals, y_vals, 1)
        return {"slope": float(m), "intercept": float(b)}
    except Exception:
        return None


# ===================== HOUSING =====================
def process_housing(address: str, housing_df: pd.DataFrame, others_df: pd.DataFrame):
    area_data = housing_df[housing_df["Address"] == address]
    if area_data.empty:
        return {"error": "No data found for this address."}

    # Summary stats
    summary = {
        "address": address,
        "count": len(area_data),
        "avg_price": area_data["Price"].mean(),
        "median_price": area_data["Price"].median(),
        "min_price": area_data["Price"].min(),
        "max_price": area_data["Price"].max(),
        "avg_aqi": others_df.loc[others_df["Address"] == address, "AQI"].mean() if address in others_df["Address"].values else None,
        "avg_distance_to_metro": area_data["Distance to Metro"].mean(),
        "avg_area": area_data["Area"].mean(),
        "avg_building_age": area_data["Building Age"].mean(),
    }

    # 1️⃣ Price vs Availability (Histogram)
    hist, bin_edges = np.histogram(area_data["Price"], bins=10)
    histogram = [
        {
            "bin_start": float(bin_edges[i]),
            "bin_end": float(bin_edges[i + 1]),
            "count": int(hist[i]),
            "bin_center": float((bin_edges[i] + bin_edges[i + 1]) / 2),
        }
        for i in range(len(hist))
    ]

    # 2️⃣ Price vs Area
    price_vs_area = [{"x": float(row["Area"]), "y": float(row["Price"])} for _, row in area_data.iterrows()]

    # 3️⃣ Price vs Bedrooms
    price_vs_bedrooms = (
        area_data.groupby("Bedroom")["Price"]
        .mean()
        .reset_index()
        .rename(columns={"Bedroom": "x", "Price": "y"})
        .to_dict(orient="records")
    )

    # 4️⃣ Price vs Bathrooms
    price_vs_bathrooms = (
        area_data.groupby("Bathroom")["Price"]
        .mean()
        .reset_index()
        .rename(columns={"Bathroom": "x", "Price": "y"})
        .to_dict(orient="records")
    )

    # 5️⃣ Average Price vs Furnishing
    price_vs_furnishing = (
        area_data.groupby("Furnishing")["Price"]
        .mean()
        .reset_index()
        .rename(columns={"Furnishing": "x", "Price": "y"})
        .to_dict(orient="records")
    )

    # 6️⃣ Price vs Building Age (with regression)
    X_age = area_data[["Building Age"]]
    y_price = area_data["Price"]
    model_age = LinearRegression().fit(X_age, y_price)
    slope_age, intercept_age = model_age.coef_[0], model_age.intercept_
    price_vs_building_age = [{"x": float(a), "y": float(b)} for a, b in zip(X_age["Building Age"], y_price)]

    # 7️⃣ Price vs 10-Year Rent Projection (with regression)
    X_rent = area_data[["Projected 10Y Rent"]]
    model_rent = LinearRegression().fit(X_rent, y_price)
    slope_rent, intercept_rent = model_rent.coef_[0], model_rent.intercept_
    price_vs_rent_projection = [{"x": float(a), "y": float(b)} for a, b in zip(X_rent["Projected 10Y Rent"], y_price)]

    regression = {
        "price_vs_building_age": {"slope": slope_age, "intercept": intercept_age},
        "price_vs_rent_projection": {"slope": slope_rent, "intercept": intercept_rent},
    }

    return {
        "summary": summary,
        "histogram": histogram,
        "price_vs_area": price_vs_area,
        "price_vs_bedrooms": price_vs_bedrooms,
        "price_vs_bathrooms": price_vs_bathrooms,
        "price_vs_furnishing": price_vs_furnishing,
        "price_vs_building_age": price_vs_building_age,
        "price_vs_rent_projection": price_vs_rent_projection,
        "regression": regression,
    }


# ===================== OTHERS =====================
def process_others(csv_path: Path):
    df = pd.read_csv(csv_path)
    if "Address" not in df.columns:
        raise ValueError("Others.csv must contain 'Address' column")

    localities = df["Address"].dropna().unique().tolist()
    localities_info, scatter_aqi_crime = [], []

    for addr in localities:
        sub = df[df["Address"] == addr].copy()
        aqi = pd.to_numeric(sub["AQI"], errors="coerce").mean()
        crimes = pd.to_numeric(sub["Total Crimes"], errors="coerce").mean()
        walk = pd.to_numeric(sub["Walkability Score"], errors="coerce").mean()
        fire = pd.to_numeric(sub["Firestations"], errors="coerce").mean()
        hosp = pd.to_numeric(sub["Hospitals"], errors="coerce").mean()
        schools = pd.to_numeric(sub["Schools"], errors="coerce").mean()

        summary = {
            "address": addr,
            "avg_aqi": float(aqi) if pd.notna(aqi) else None,
            "total_crimes": int(crimes) if pd.notna(crimes) else None,
            "walkability_score": float(walk) if pd.notna(walk) else None,
            "review": sub["Review"].iloc[0] if "Review" in sub.columns else "",
        }

        if pd.notna(aqi) and pd.notna(crimes):
            scatter_aqi_crime.append({"address": addr, "x": float(aqi), "y": float(crimes)})

        amenities = []
        for name, val in [("Firestations", fire), ("Hospitals", hosp), ("Schools", schools)]:
            if pd.notna(val):
                amenities.append({"category": name, "count": val})

        reg = regression_coeffs([p["x"] for p in scatter_aqi_crime], [p["y"] for p in scatter_aqi_crime]) if len(scatter_aqi_crime) > 2 else None

        out_data = {
            "summary": summary,
            "amenities": amenities,
            "aqi_vs_crime": scatter_aqi_crime,
            "regression": {"aqi_vs_crime": reg},
        }

        fname = safe_name(addr) + ".json"
        with open(OUT_DIR / "others_by_area" / fname, "w", encoding="utf-8") as f:
            json.dump(json_safe(out_data), f, indent=2)

        localities_info.append({
            "address": addr,
            "aqi": summary["avg_aqi"],
            "crimes": summary["total_crimes"],
            "walkability": summary["walkability_score"]
        })

    reg_global = regression_coeffs([p["x"] for p in scatter_aqi_crime], [p["y"] for p in scatter_aqi_crime]) if len(scatter_aqi_crime) > 2 else None

    with open(OUT_DIR / "aqi_vs_crime.json", "w", encoding="utf-8") as f:
        json.dump({"data": scatter_aqi_crime, "regression": reg_global}, f, indent=2)
    with open(OUT_DIR / "localities_others.json", "w", encoding="utf-8") as f:
        json.dump(localities_info, f, indent=2)

    print(f"Others: wrote {len(localities_info)} area JSON files.")


# ===================== RESTAURANTS =====================
def process_restaurants(csv_path: Path):
    df = pd.read_csv(csv_path)
    if "Address" not in df.columns:
        raise ValueError("Restaurants.csv must contain 'Address' column")

    localities = df["Address"].dropna().unique().tolist()
    info_list = []

    for addr in localities:
        sub = df[df["Address"] == addr].copy()
        if "Rating" in sub.columns:
            sub["Rating"] = pd.to_numeric(sub["Rating"], errors="coerce")
        if "Price for 2" in sub.columns:
            sub["Price for 2"] = pd.to_numeric(sub["Price for 2"], errors="coerce")

        ratings = sub["Rating"].dropna().tolist()
        price_for_two = sub["Price for 2"].dropna().tolist()

        payload = {
            "address": addr,
            "count": int(len(sub)),
            "ratings_hist": histogram_bins(ratings),
            "price_for_two_hist": histogram_bins(price_for_two),
            "avg_rating": float(np.nanmean(ratings)) if len(ratings) else None,
            "avg_price_for_two": float(np.nanmean(price_for_two)) if len(price_for_two) else None,
        }

        fname = safe_name(addr) + ".json"
        with open(OUT_DIR / "restaurants_by_area" / fname, "w", encoding="utf-8") as f:
            json.dump(json_safe(payload), f, indent=2)
        info_list.append({"address": addr, "file": f"restaurants_by_area/{fname}"})

    with open(OUT_DIR / "localities_restaurants.json", "w", encoding="utf-8") as f:
        json.dump(info_list, f, indent=2)
    print(f"Restaurants: wrote {len(info_list)} area JSON files.")


# ===================== GLOBAL BUILDER =====================
def build_price_vs_aqi_and_city_averages():
    housing_dir = OUT_DIR / "housing_by_area"
    others_dir = OUT_DIR / "others_by_area"

    price_vs_aqi, city_price_sum, city_aqi_sum, city_crime_sum, city_walk_sum, count = [], 0, 0, 0, 0, 0

    for f in housing_dir.glob("*.json"):
        obj = json.loads(f.read_text(encoding="utf-8"))
        summary = obj.get("summary", {})
        addr = summary.get("address") or f.stem
        avg_price, avg_aqi = summary.get("avg_price"), summary.get("avg_aqi")
        if avg_price and avg_aqi:
            price_vs_aqi.append({"address": addr, "x": float(avg_aqi), "y": round(float(avg_price) / 1e5, 3)})

    map_path = OUT_DIR / "localities.json"
    if map_path.exists():
        entries = json.loads(map_path.read_text(encoding="utf-8"))
        for e in entries:
            address = e.get("address")
            h_path = OUT_DIR / f"housing_by_area/{safe_name(address)}.json"
            o_path = OUT_DIR / f"others_by_area/{safe_name(address)}.json"
            h = json.loads(h_path.read_text(encoding="utf-8")) if h_path.exists() else {}
            o = json.loads(o_path.read_text(encoding="utf-8")) if o_path.exists() else {}
            s_h, s_o = h.get("summary", {}), o.get("summary", {})

            got_any = False
            if s_h.get("avg_price"): city_price_sum += float(s_h["avg_price"]); got_any = True
            if s_h.get("avg_aqi"): city_aqi_sum += float(s_h["avg_aqi"]); got_any = True
            if s_o.get("total_crimes"): city_crime_sum += float(s_o["total_crimes"]); got_any = True
            if s_o.get("walkability_score"): city_walk_sum += float(s_o["walkability_score"]); got_any = True
            if got_any: count += 1

    city_averages = {}
    if count > 0:
        city_averages = {
            "medianPrice": int(city_price_sum / count),
            "aqi": int(round(city_aqi_sum / count)),
            "crimeIndex": int(round(city_crime_sum / count)),
            "transitScore": int(round(city_walk_sum / count)),
            "count": count
        }

    (OUT_DIR / "price_vs_aqi.json").write_text(json.dumps({"data": price_vs_aqi}, indent=2), encoding="utf-8")
    (OUT_DIR / "city_averages.json").write_text(json.dumps(city_averages, indent=2), encoding="utf-8")
    print(f"Wrote price_vs_aqi.json and city_averages.json")


# ===================== MAIN =====================
def main():
    print("🚀 Preprocess script started...")

    parser = argparse.ArgumentParser(description="Preprocess CSVs into JSONs for SettleWise")
    parser.add_argument("--data-dir", default="data", help="Input data directory")
    parser.add_argument("--out-dir", default="data_json", help="Output JSON directory")
    parser.add_argument("--bins", type=int, default=12, help="Number of bins for histograms")
    args = parser.parse_args()

    ensure_dirs()

    data_dir = Path(args.data_dir)
    out_dir = Path(args.out_dir)

    # Load dataframes if available
    housing_df = others_df = restaurants_df = None

    if (data_dir / "Housing.csv").exists():
        print("🏠 Loading Housing.csv ...")
        housing_df = pd.read_csv(data_dir / "Housing.csv")

    if (data_dir / "Others.csv").exists():
        print("🏙️ Loading Others.csv ...")
        others_df = pd.read_csv(data_dir / "Others.csv")

    if (data_dir / "Restaurants.csv").exists():
        print("🍽️ Loading Restaurants.csv ...")
        restaurants_df = pd.read_csv(data_dir / "Restaurants.csv")

    # Process housing (per locality)
    if housing_df is not None and others_df is not None:
        print("📊 Processing Housing data by area...")
        localities = housing_df["Address"].dropna().unique().tolist()
        loc_info = []

        for addr in localities:
            print(f"   ➤ {addr}")
            result = process_housing(addr, housing_df, others_df)
            if "error" in result:
                continue

            fname = safe_name(addr) + ".json"
            with open(out_dir / "housing_by_area" / fname, "w", encoding="utf-8") as f:
                json.dump(json_safe(result), f, indent=2)
            loc_info.append({"address": addr, "file": f"housing_by_area/{fname}"})

        json.dump(loc_info, open(out_dir / "localities_housing.json", "w", encoding="utf-8"), indent=2)
        print(f"✅ Housing: wrote {len(loc_info)} JSON files.")

    # Process Others
    if others_df is not None:
        print("🌆 Processing Others.csv ...")
        process_others(data_dir / "Others.csv")

    # Process Restaurants
    if restaurants_df is not None:
        print("🍴 Processing Restaurants.csv ...")
        process_restaurants(data_dir / "Restaurants.csv")

    # Merge locality lists
    print("📍 Merging locality lists...")
    all_localities = set()
    for f in ["localities_housing.json", "localities_others.json", "localities_restaurants.json"]:
        p = out_dir / f
        if p.exists():
            arr = json.load(open(p, "r", encoding="utf-8"))
            for entry in arr:
                if entry.get("address"):
                    all_localities.add(entry["address"])

    json.dump(
        [{"address": a, "safe": safe_name(a)} for a in sorted(all_localities)],
        open(out_dir / "localities.json", "w", encoding="utf-8"),
        indent=2,
    )

    # Build aggregates
    print("📈 Building aggregate city-level data...")
    build_price_vs_aqi_and_city_averages()

    print("✅ Preprocessing complete. All area JSONs generated successfully.")


if __name__ == "__main__":
    main()
