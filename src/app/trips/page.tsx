import Link from "next/link";
import { ArrowLeft, Calendar, Camera, MapPin, Route, Sparkles } from "lucide-react";

const trips = [
  {
    title: "Paris, France",
    dates: "Jan 12, 2026",
    photos: 2,
    stops: ["Eiffel Tower", "Central Paris"],
    coordinates: "48.8566° N, 2.3522° E",
  },
  {
    title: "Metz, France",
    dates: "Jan 14, 2026",
    photos: 2,
    stops: ["Metz Cathedral", "City Center"],
    coordinates: "49.1193° N, 6.1757° E",
  },
  {
    title: "Zurich, Switzerland",
    dates: "Jan 18, 2026",
    photos: 2,
    stops: ["Old Town", "Lake Zurich"],
    coordinates: "47.3769° N, 8.5417° E",
  },
  {
    title: "Milan, Italy",
    dates: "Jan 21, 2026",
    photos: 2,
    stops: ["Duomo di Milano", "City Center"],
    coordinates: "45.4642° N, 9.1900° E",
  },
];

export default function TripsPage() {
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

          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
            Generated Trips
          </div>
        </nav>

        <div className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <Sparkles className="h-4 w-4" />
            AI trip inference preview
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            Waypoint detected 4 trips from your uploaded metadata.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            This preview shows how Waypoint will group timestamped GPS photo
            data into clean travel stops, routes, and shareable trip histories.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {trips.map((trip, index) => (
              <div
                key={trip.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-blue-400/40 hover:bg-white/[0.07]"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-200">Trip {index + 1}</p>
                    <h2 className="mt-1 text-2xl font-bold">{trip.title}</h2>
                  </div>

                  <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-200">
                    {trip.photos} photos
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
                    {trip.stops.join(" → ")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="rounded-[1.5rem] bg-[#0d1b2f] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Route summary</p>
                  <h2 className="text-2xl font-bold">Europe 2026</h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
                  <Route className="h-6 w-6" />
                </div>
              </div>

              <div className="relative h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950">
                <div className="absolute left-[18%] top-[18%] h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_24px_8px_rgba(147,197,253,0.45)]" />
                <div className="absolute left-[35%] top-[30%] h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_24px_8px_rgba(147,197,253,0.45)]" />
                <div className="absolute right-[32%] top-[48%] h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_24px_8px_rgba(147,197,253,0.45)]" />
                <div className="absolute right-[18%] bottom-[18%] h-4 w-4 rounded-full bg-blue-300 shadow-[0_0_24px_8px_rgba(147,197,253,0.45)]" />

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 500 520"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M90 95 C 140 130, 145 155, 175 158 S 245 190, 290 250 S 350 360, 410 425"
                    stroke="#60a5fa"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="12 12"
                  />
                </svg>

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                  <p className="text-sm text-slate-300">Generated route</p>
                  <p className="font-semibold">
                    Paris → Metz → Zurich → Milan
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button className="rounded-full bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400">
                  Save trip history
                </button>

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