## Still Needs to Be Implemented

### Frontend

- Build a dedicated dashboard page for users to view all generated trip histories.
- Add a detailed trip page for each detected trip, including route points, photos, dates, and map preview.
- Replace the current mock map visualization with an actual interactive map using Google Maps API.
- Add loading, empty, and error states for the upload and trip generation flow.
- Improve mobile responsiveness across landing, upload, and trip pages.
- Add editable trip titles so users can rename generated trips.
- Add public sharing pages for generated travel histories.

### Upload and Metadata Processing

- Support real Apple Photos and Google Photos metadata exports.
- Add validation for malformed CSV files, missing GPS coordinates, invalid timestamps, and duplicate photo records.
- Allow users to upload multiple files or metadata exports at once.
- Store uploaded metadata persistently instead of only using browser localStorage.
- Add support for photo image uploads and optional photo previews.

### Trip Inference and ML Pipeline

- Connect the frontend upload flow to the Python DBSCAN clustering pipeline.
- Move trip inference from browser-side logic to a backend API route or Python service.
- Tune DBSCAN parameters for different travel patterns, including walking-distance clusters, city-level clusters, and multi-country trips.
- Add time-aware clustering so trips are grouped by both geographic distance and travel dates.
- Add ambiguity resolution for edge cases where locations are close together but belong to different trips.
- Generate cleaner trip labels using reverse geocoding, such as city, state, and country names.
- Add test cases for the clustering pipeline using sample metadata files.

### Maps and Geospatial Features

- Integrate Google Maps API for route rendering and interactive map display.
- Add route lines connecting detected stops in chronological order.
- Add map markers for photo locations and trip centers.
- Use GeoPandas for spatial joins and advanced geospatial analysis.
- Add reverse geocoding for coordinates to city/country names.
- Add county-level or region-level spatial joins as a future enhancement.

### Backend and Database

- Set up PostgreSQL database models for users, trips, trip points, and shared pages.
- Connect Prisma schema to the application.
- Replace localStorage with persistent database storage.
- Add API routes for uploading metadata, generating trips, saving trips, and retrieving trip histories.
- Add authentication so each user has their own private travel data.
- Add secure file storage using AWS S3, Supabase Storage, or another cloud storage provider.

### Sharing and Animation

- Build public share links for completed trip histories.
- Add animated route playback across trip points.
- Allow users to customize map style, trip title, description, and visibility.
- Add export options such as image, video, or shareable webpage.
- Add privacy controls so users can choose whether trips are private or public.

### Deployment and Production Readiness

- Deploy the Next.js frontend on Vercel.
- Deploy the database using Supabase, Neon, Railway, or another PostgreSQL provider.
- Add environment variables for database URLs, API keys, and map credentials.
- Add basic security checks for uploaded files.
- Add documentation for local setup, environment variables, and running the ML pipeline.
- Add screenshots or demo GIFs to the README.