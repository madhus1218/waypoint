"use client";

import { useState, type ReactNode } from "react";
import Papa from "papaparse";
import { Upload, FileText, MapPin, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

type TravelPoint = {
  filename: string;
  latitude: string;
  longitude: string;
  timestamp: string;
};

export default function UploadPage() {
  const [points, setPoints] = useState<TravelPoint[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileName(file.name);
    setError("");

    Papa.parse<TravelPoint>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;

        const validRows = rows.filter(
          (row) => row.filename && row.latitude && row.longitude && row.timestamp
        );

        if (validRows.length === 0) {
          setError(
            "No valid rows found. Make sure your CSV has filename, latitude, longitude, and timestamp columns."
          );
          setPoints([]);
          return;
        }

        setPoints(validRows);
      },
      error: () => {
        setError("Something went wrong while parsing the CSV file.");
        setPoints([]);
      },
    });
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <nav className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            Waypoint Upload
          </div>
        </nav>

        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-500/20 text-blue-300">
            <Upload className="h-7 w-7" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Upload your travel metadata.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Start by uploading a CSV export with photo timestamps and GPS
            coordinates. Waypoint will use this data to detect trips and
            generate your travel timeline.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <label className="flex min-h-80 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-blue-400/30 bg-blue-400/5 p-8 text-center transition hover:border-blue-300 hover:bg-blue-400/10">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500 text-white">
                <FileText className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-bold">Choose your CSV file</h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                For the MVP, use a CSV with filename, latitude, longitude, and
                timestamp columns.
              </p>

              <div className="mt-7 rounded-full bg-blue-500 px-7 py-3 font-semibold text-white transition hover:bg-blue-400">
                Upload CSV
              </div>

              {fileName && (
                <p className="mt-4 text-sm text-blue-200">
                  Selected: {fileName}
                </p>
              )}

              {error && (
                <p className="mt-4 max-w-md text-sm text-red-300">{error}</p>
              )}
            </label>
          </div>

          <div className="space-y-4">
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Location points"
              description={`${points.length} valid travel point${
                points.length === 1 ? "" : "s"
              } loaded from your CSV.`}
            />

            <InfoCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Trip detection"
              description="Next, Waypoint will cluster nearby points to infer trips, stops, and routes."
            />

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-bold">Expected CSV format</h3>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <pre className="overflow-x-auto p-4 text-xs leading-6 text-slate-300">
{`filename,latitude,longitude,timestamp
photo1.jpg,48.8566,2.3522,2026-01-12T10:00:00
photo2.jpg,49.1193,6.1757,2026-01-14T14:30:00
photo3.jpg,47.3769,8.5417,2026-01-18T09:15:00`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {points.length > 0 && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold">Parsed metadata preview</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Showing the first {Math.min(points.length, 8)} rows from your
                  uploaded CSV.
                </p>
              </div>

              <Link
                href="/trips"
                className="rounded-full bg-blue-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-400"
              >
                Generate trips
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white/10 text-slate-300">
                  <tr>
                    <th className="px-4 py-3">Filename</th>
                    <th className="px-4 py-3">Latitude</th>
                    <th className="px-4 py-3">Longitude</th>
                    <th className="px-4 py-3">Timestamp</th>
                  </tr>
                </thead>

                <tbody>
                  {points.slice(0, 8).map((point, index) => (
                    <tr key={index} className="border-t border-white/10">
                      <td className="px-4 py-3 text-slate-200">
                        {point.filename}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {point.latitude}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {point.longitude}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {point.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
        {icon}
      </div>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}