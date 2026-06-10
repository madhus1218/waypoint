# Waypoint Requirements

## Current Status

Waypoint is currently a working frontend MVP prototype for generating travel timelines from uploaded photo metadata. Users can upload a CSV containing filenames, GPS coordinates, and timestamps. The app parses the metadata, stores it temporarily in browser localStorage, clusters nearby GPS points into detected trips, labels known locations, and displays the results as a chronological travel timeline.

The project currently runs as a static Next.js app and has been successfully deployed through GitHub Pages. Persistent storage, authentication, backend trip generation, and production-grade map integrations are not implemented yet.

## Implemented So Far

### Core App Setup

- Next.js app structure using the App Router.
- TypeScript-based frontend.
- Tailwind CSS styling.
- GitHub Pages deployment.
- Passing production build.

### Upload Flow

- CSV upload page at `/upload`.
- CSV parsing using PapaParse.
- Required metadata fields:
  - `filename`
  - `latitude`
  - `longitude`
  - `timestamp`
- Basic CSV validation for required fields.
- Metadata preview table showing uploaded rows.
- Temporary browser storage using `localStorage`.

### Trip Generation

- Trip results page at `/trips`.
- Browser-side distance-based clustering for GPS points.
- Chronological sorting of generated trips.
- Location naming helper for known city coordinates.
- Trip confidence labels based on number of photo points.
- Trip insight summaries explaining how points were grouped.
- Travel summary stats:
  - Trips detected
  - Photos uploaded
  - Travel days
  - Named locations

### Trip Timeline UI

- Chronological travel timeline layout.
- Trip cards with:
  - Location title
  - Date range
  - Photo count
  - Coordinates
  - Confidence label
  - Insight summary
- Expandable trip details showing individual photo points.
- Route summary panel.
- Route/map preview component.
- Clear uploaded data action.
- Upload another CSV action.
- Empty state when no metadata has been uploaded.

## Still Needs to Be Implemented

### Frontend

- Build a saved trip history dashboard where users can view past generated trips, not just the current uploaded CSV.
- Add a detailed trip page for each detected trip, including route points, photos, dates, confidence score, and map preview.
- Replace the current mock/static map preview with an actual interactive map using Google Maps API or Mapbox.
- Improve mobile responsiveness across landing, upload, and trips pages.
- Add editable trip titles so users can rename generated trips.
- Add loading and error states for larger upload and trip generation flows.
- Add public sharing pages for generated travel histories.

### Upload and Metadata Processing

- Support real Apple Photos and Google Photos metadata exports.
- Add stronger validation for malformed CSV files, missing GPS coordinates, invalid timestamps, and duplicate photo records.
- Allow users to upload multiple files or metadata exports at once.
- Store uploaded metadata persistently instead of only using browser localStorage.
- Add support for photo image uploads and optional photo previews.

### Trip Inference and ML Pipeline

- Connect the frontend upload flow to the Python DBSCAN clustering pipeline.
- Move trip inference from browser-side logic to a backend API route or Python service.
- Tune clustering parameters for different travel patterns, including walking-distance clusters, city-level clusters, and multi-country trips.
- Add time-aware clustering so trips are grouped by both geographic distance and travel dates.
- Add ambiguity resolution for edge cases where locations are close together but belong to different trips.
- Replace the hardcoded location matcher with reverse geocoding for city, state, and country names.
- Add test cases for the clustering pipeline using sample metadata files.

### Maps and Geospatial Features

- Integrate Google Maps API or Mapbox for interactive map display.
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

- Decide between GitHub Pages for static demo hosting and Vercel for full-stack deployment.
- Deploy the database using Supabase, Neon, Railway, or another PostgreSQL provider.
- Add environment variables for database URLs, API keys, and map credentials.
- Add basic security checks for uploaded files.
- Add documentation for local setup, environment variables, and running the ML pipeline.
- Add screenshots or demo GIFs to the README.
- Add basic tests for upload parsing, trip generation, and timeline rendering.

## Immediate Next Steps

1. Add editable trip titles on the trip timeline page.
2. Add a dedicated trip detail page for each detected trip.
3. Improve the route preview with real map markers and route lines.
4. Add stronger CSV validation and user-facing upload errors.
5. Begin planning persistent storage with Prisma and PostgreSQL.






## Still Needs to Be Implemented

### Frontend

- Build a saved trip history dashboard where users can view past generated trips, not just the current uploaded CSV.
- Add a detailed trip page for each detected trip, including route points, photos, dates, confidence score, and map preview.
- Replace the current mock/static map preview with an actual interactive map using Google Maps API or Mapbox.
- Improve mobile responsiveness across landing, upload, and trips pages.
- Add editable trip titles so users can rename generated trips.
- Add loading and error states for larger upload and trip generation flows.
- Add public sharing pages for generated travel histories.

### Upload and Metadata Processing

- Support real Apple Photos and Google Photos metadata exports.
- Add stronger validation for malformed CSV files, missing GPS coordinates, invalid timestamps, and duplicate photo records.
- Allow users to upload multiple files or metadata exports at once.
- Store uploaded metadata persistently instead of only using browser localStorage.
- Add support for photo image uploads and optional photo previews.

### Trip Inference and ML Pipeline

- Connect the frontend upload flow to the Python DBSCAN clustering pipeline.
- Move trip inference from browser-side logic to a backend API route or Python service.
- Tune clustering parameters for different travel patterns, including walking-distance clusters, city-level clusters, and multi-country trips.
- Add time-aware clustering so trips are grouped by both geographic distance and travel dates.
- Add ambiguity resolution for edge cases where locations are close together but belong to different trips.
- Replace the hardcoded location matcher with reverse geocoding for city, state, and country names.
- Add test cases for the clustering pipeline using sample metadata files.

### Maps and Geospatial Features

- Integrate Google Maps API or Mapbox for interactive map display.
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

- Decide between GitHub Pages for static demo hosting and Vercel for full-stack deployment.
- Deploy the database using Supabase, Neon, Railway, or another PostgreSQL provider.
- Add environment variables for database URLs, API keys, and map credentials.
- Add basic security checks for uploaded files.
- Add documentation for local setup, environment variables, and running the ML pipeline.
- Add screenshots or demo GIFs to the README.
- Add basic tests for upload parsing, trip generation, and timeline rendering.