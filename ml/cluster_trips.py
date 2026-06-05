import json
import math
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN


EARTH_RADIUS_KM = 6371.0088


def load_points(csv_path: str) -> pd.DataFrame:
    """Load travel metadata from a CSV file."""
    df = pd.read_csv(csv_path)

    required_columns = {"filename", "latitude", "longitude", "timestamp"}
    missing_columns = required_columns - set(df.columns)

    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    df = df.dropna(subset=["latitude", "longitude", "timestamp"]).copy()
    df["latitude"] = df["latitude"].astype(float)
    df["longitude"] = df["longitude"].astype(float)
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    df = df.dropna(subset=["timestamp"]).copy()
    df = df.sort_values("timestamp").reset_index(drop=True)

    return df


def run_dbscan(df: pd.DataFrame, radius_km: float = 80, min_samples: int = 1) -> pd.DataFrame:
    """
    Cluster GPS points using DBSCAN with haversine distance.

    radius_km controls how close points need to be to belong to the same trip.
    min_samples=1 allows small trips with only one photo point.
    """
    coords_radians = np.radians(df[["latitude", "longitude"]].to_numpy())

    epsilon = radius_km / EARTH_RADIUS_KM

    model = DBSCAN(
        eps=epsilon,
        min_samples=min_samples,
        metric="haversine",
        algorithm="ball_tree",
    )

    df = df.copy()
    df["cluster_id"] = model.fit_predict(coords_radians)

    return df


def build_trip_summary(df: pd.DataFrame) -> list[dict]:
    """Convert clustered points into trip summaries."""
    trips = []

    clustered = df[df["cluster_id"] != -1]

    for cluster_id, group in clustered.groupby("cluster_id"):
        group = group.sort_values("timestamp")

        avg_latitude = group["latitude"].mean()
        avg_longitude = group["longitude"].mean()

        trip = {
            "cluster_id": int(cluster_id),
            "title": f"Detected Trip {int(cluster_id) + 1}",
            "photo_count": int(len(group)),
            "start_date": group["timestamp"].min().isoformat(),
            "end_date": group["timestamp"].max().isoformat(),
            "center": {
                "latitude": round(float(avg_latitude), 6),
                "longitude": round(float(avg_longitude), 6),
            },
            "points": [
                {
                    "filename": row["filename"],
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                    "timestamp": row["timestamp"].isoformat(),
                }
                for _, row in group.iterrows()
            ],
        }

        trips.append(trip)

    trips = sorted(trips, key=lambda trip: trip["start_date"])

    return trips


def save_output(trips: list[dict], output_path: str) -> None:
    """Save trip summaries as JSON."""
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with output_file.open("w", encoding="utf-8") as file:
        json.dump(trips, file, indent=2)


def main() -> None:
    input_path = "ml/sample_data.csv"
    output_path = "ml/clustered_trips.json"

    df = load_points(input_path)
    clustered_df = run_dbscan(df, radius_km=80, min_samples=1)
    trips = build_trip_summary(clustered_df)

    save_output(trips, output_path)

    print(f"Loaded {len(df)} photo metadata points")
    print(f"Detected {len(trips)} trip clusters")
    print(f"Saved output to {output_path}")

    for trip in trips:
        print(
            f"- {trip['title']}: {trip['photo_count']} photos, "
            f"{trip['start_date']} → {trip['end_date']}"
        )


if __name__ == "__main__":
    main()