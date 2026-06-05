## ML Trip Inference Pipeline

Waypoint includes a Python-based trip inference pipeline that clusters timestamped GPS photo metadata into detected trips.

The current pipeline:

- Loads Apple/Google-style photo metadata from CSV
- Validates latitude, longitude, filename, and timestamp fields
- Uses scikit-learn DBSCAN with haversine distance for geospatial clustering
- Generates trip summaries with photo counts, date ranges, center coordinates, and route points
- Outputs clustered trips as JSON for future frontend/API integration

Run the pipeline:

```bash
pip install -r ml/requirements.txt
python ml/cluster_trips.py