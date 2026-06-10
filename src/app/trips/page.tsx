"use client";

import Link from "next/link";
import RouteMapPreview from "@/components/RouteMapPreview";
import { getLocationName } from "@/lib/locationNames";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Camera,
  MapPin,
  Route,
  Sparkles,
  Upload,
} from "lucide-react";

type TravelPoint = {
  filename: string;
  latitude: string;
  longitude: string;
  timestamp: string;
};

type GeneratedTrip = {
  title: string;
  dates: string;
  photos: number;
  coordinates: string;
  confidence: "High" | "Medium" | "Low";
  insight: string;
  startTimestamp: string;
  endTimestamp: string;
  points: TravelPoint[];
};

function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCoordinate(value: string, directionPositive: string, directionNegative: string) {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return value;
  }

  return `${Math.abs(num).toFixed(4)}° ${num >= 0 ? directionPositive : directionNegative}`;
}

function getTripConfidence(pointCount: number): "High" | "Medium" | "Low" {
  if (pointCount >= 5) {
    return "High";
  }

  if (pointCount >= 3) {
    return "Medium";
  }

  return "Low";
}

function getTripInsight(
  title: string,
  pointCount: number,
  startTimestamp: string,
  endTimestamp: string
) {
  const startDate = new Date(startTimestamp);
  const endDate = new Date(endTimestamp);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `${pointCount} photo point${pointCount === 1 ? "" : "s"} grouped near ${title}.`;
  }

  const dayCount =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  if (pointCount === 1) {
    return `1 photo point detected near ${title}.`;
  }

  return `${pointCount} photo points grouped near ${title} over ${dayCount} day${
    dayCount === 1 ? "" : "s"
  }.`;
}

function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadiusMiles = 3958.8;

  const latDistance = ((lat2 - lat1) * Math.PI) / 180;
  const lonDistance = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(lonDistance / 2) *
      Math.sin(lonDistance / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
}

function generateTrips(points: TravelPoint[]): GeneratedTrip[] {
  const sortedPoints = [...points].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const clusters: TravelPoint[][] = [];
  const maxDistanceMiles = 75;

  sortedPoints.forEach((point) => {
    const lat = Number(point.latitude);
    const lng = Number(point.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return;
    }

    const matchingCluster = clusters.find((cluster) => {
      const clusterLat =
        cluster.reduce((sum, item) => sum + Number(item.latitude), 0) /
        cluster.length;

      const clusterLng =
        cluster.reduce((sum, item) => sum + Number(item.longitude), 0) /
        cluster.length;

      const distance = calculateDistanceMiles(lat, lng, clusterLat, clusterLng);

      return distance <= maxDistanceMiles;
    });

    if (matchingCluster) {
      matchingCluster.push(point);
    } else {
      clusters.push([point]);
    }
  });

  return clusters
    .map((tripPoints) => {
      const sortedTripPoints = [...tripPoints].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const firstPoint = sortedTripPoints[0];
      const lastPoint = sortedTripPoints[sortedTripPoints.length - 1];

      const avgLat =
        sortedTripPoints.reduce(
          (sum, point) => sum + Number(point.latitude),
          0
        ) / sortedTripPoints.length;

      const avgLng =
        sortedTripPoints.reduce(
          (sum, point) => sum + Number(point.longitude),
          0
        ) / sortedTripPoints.length;

      const startDate = formatDate(firstPoint.timestamp);
      const endDate = formatDate(lastPoint.timestamp);
      const tripTitle = getLocationName(avgLat, avgLng);

      return {
        title: tripTitle,
        dates: startDate === endDate ? startDate : `${startDate} – ${endDate}`,
        photos: sortedTripPoints.length,
        coordinates: `${formatCoordinate(
          String(avgLat),
          "N",
          "S"
        )}, ${formatCoordinate(String(avgLng), "E", "W")}`,
        confidence: getTripConfidence(sortedTripPoints.length),
        insight: getTripInsight(
          tripTitle,
          sortedTripPoints.length,
          firstPoint.timestamp,
          lastPoint.timestamp
        ),
        startTimestamp: firstPoint.timestamp,
        endTimestamp: lastPoint.timestamp,
        points: sortedTripPoints,
      };
    })
    .sort(
      (a, b) =>
        new Date(a.startTimestamp).getTime() -
        new Date(b.startTimestamp).getTime()
    );
}

export default function TripsPage() {
  const [points, setPoints] = useState<TravelPoint[]>([]);
  const [expandedTripIndex, setExpandedTripIndex] = useState<number | null>(null);
  const [customTripTitles, setCustomTripTitles] = useState<Record<number, string>>({});

  useEffect(() => {
    const savedPoints = localStorage.getItem("waypoint-points");

    if (!savedPoints) {
      setPoints([]);
      return;
    }

    try {
      const parsedPoints = JSON.parse(savedPoints) as TravelPoint[];
      setPoints(parsedPoints);
    } catch {
      setPoints([]);
    }
  }, []);

  useEffect(() => {
    const savedTitles = localStorage.getItem("waypoint-custom-trip-titles");

    if (!savedTitles) {
      return;
    }

    try {
      const parsedTitles = JSON.parse(savedTitles) as Record<number, string>;
      setCustomTripTitles(parsedTitles);
    } catch {
      setCustomTripTitles({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "waypoint-custom-trip-titles",
      JSON.stringify(customTripTitles)
    );
  }, [customTripTitles]);

  const trips = useMemo(() => generateTrips(points), [points]);
  const tripStats = useMemo(() => {
    const namedLocations = trips.filter(
      (trip) => trip.title !== "Unnamed Travel Stop"
    ).length;

    const timestamps = points
      .map((point) => new Date(point.timestamp))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    let travelDays = 0;

    if (timestamps.length > 0) {
      const firstDate = timestamps[0];
      const lastDate = timestamps[timestamps.length - 1];

      travelDays =
        Math.ceil(
          (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
    }

    return {
      tripsDetected: trips.length,
      photosUploaded: points.length,
      travelDays,
      namedLocations,
    };
  }, [points, trips]);

  function handleClearData() {
    localStorage.removeItem("waypoint-points");
    localStorage.removeItem("waypoint-custom-trip-titles");
    setPoints([]);
    setExpandedTripIndex(null);
    setCustomTripTitles({});
  }

  function handleTripTitleChange(index: number, title: string) {
    setCustomTripTitles((currentTitles) => ({
      ...currentTitles,
      [index]: title,
    }));
  }


  if (points.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-6 text-white">
        <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-300">
            <Upload className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">No metadata uploaded yet.</h1>

          <p className="mt-4 leading-7 text-slate-300">
            Upload a CSV first so Waypoint can generate your trip timeline from
            real location points.
          </p>

          <Link
            href="/upload"
            className="mt-7 inline-flex rounded-full bg-blue-500 px-7 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            Upload CSV
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <nav className="mb-12 flex items-center justify-between">
          <Link
            href="/upload"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to upload
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearData}
              className="rounded-full border border-red-300/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:border-red-300/40 hover:bg-red-400/10"
            >
              Clear data
            </button>

            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
              Generated Trips
            </div>
          </div>
        </nav>

        <div className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <Sparkles className="h-4 w-4" />
            Dynamic trip inference preview
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Waypoint detected {trips.length} trip{trips.length === 1 ? "" : "s"} from your uploaded metadata.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            This page now reads your uploaded CSV data from the browser and
            groups timestamped GPS points into trip cards.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Trips detected" value={tripStats.tripsDetected} />
            <StatCard label="Photos uploaded" value={tripStats.photosUploaded} />
            <StatCard label="Travel days" value={tripStats.travelDays} />
            <StatCard label="Named locations" value={tripStats.namedLocations} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 border-l border-blue-400/20 pl-6">
            {trips.map((trip, index) => (
              <div
                key={`${trip.title}-${trip.dates}`}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-blue-400/40 hover:bg-white/[0.07]"
              >
                <div className="absolute -left-3 top-8 h-6 w-6 rounded-full border-4 border-[#07111f] bg-blue-400" />

                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-200">Timeline stop {index + 1}</p>
                    <input
                      value={customTripTitles[index] ?? trip.title}
                      onChange={(event) => handleTripTitleChange(index, event.target.value)}
                      className="mt-1 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-2xl font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/50 focus:bg-white/10"
                      aria-label={`Edit title for trip ${index + 1}`}
                    />

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                      {trip.insight}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                      {trip.photos} photo{trip.photos === 1 ? "" : "s"}
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {trip.confidence} confidence
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-300" />
                    {trip.dates}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-300" />
                    {trip.coordinates}
                  </div>

                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-300" />
                    {trip.points
                      .slice(0, 3)
                      .map((point) => point.filename)
                      .join(" → ")}
                    {trip.points.length > 3 ? " ..." : ""}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setExpandedTripIndex(expandedTripIndex === index ? null : index)
                  }
                  className="mt-5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-blue-300/50 hover:bg-blue-400/10"
                >
                  {expandedTripIndex === index ? "Hide details" : "View details"}
                </button>

                {expandedTripIndex === index && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="mb-3 text-sm font-semibold text-slate-200">
                      Photo points in {customTripTitles[index] ?? trip.title}
                    </p>

                    <div className="space-y-3">
                      {trip.points.map((point, pointIndex) => (
                        <div
                          key={`${point.filename}-${pointIndex}`}
                          className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300"
                        >
                          <p className="font-semibold text-white">{point.filename}</p>
                          <p className="mt-1">{formatDate(point.timestamp)}</p>
                          <p className="mt-1">
                            {point.latitude}, {point.longitude}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="rounded-[1.5rem] bg-[#0d1b2f] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Route summary</p>
                  <h2 className="text-2xl font-bold">
                    {points.length} uploaded points
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
                  <Route className="h-6 w-6" />
                </div>
              </div>

              <RouteMapPreview points={points} />

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/upload"
                  className="rounded-full bg-blue-500 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-400"
                >
                  Upload another CSV
                </Link>

                <button className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/5">
                  Share preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}