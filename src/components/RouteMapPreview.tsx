type RoutePoint = {
  id?: string;
  filename?: string | null;
  latitude: string | number;
  longitude: string | number;
  timestamp?: string;
  takenAt?: string;
};

type RouteMapPreviewProps = {
  points: RoutePoint[];
};

function normalize(value: number, min: number, max: number) {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 80 + 10;
}

function getPointLabel(point: RoutePoint, index: number) {
  return point.filename || `Point ${index + 1}`;
}

function getPointTimestamp(point: RoutePoint) {
  return point.timestamp || point.takenAt || "";
}

export default function RouteMapPreview({ points }: RouteMapPreviewProps) {
  const validPoints = points
    .map((point) => ({
      ...point,
      latitudeNumber: Number(point.latitude),
      longitudeNumber: Number(point.longitude),
    }))
    .filter(
      (point) =>
        !Number.isNaN(point.latitudeNumber) &&
        !Number.isNaN(point.longitudeNumber)
    )
    .sort((a, b) => {
      const aTime = new Date(getPointTimestamp(a)).getTime();
      const bTime = new Date(getPointTimestamp(b)).getTime();

      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return 0;
      }

      return aTime - bTime;
    });

  if (validPoints.length === 0) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-3xl border border-white/10 bg-[#0d1b2f] p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-white">No valid coordinates</p>
          <p className="mt-2 text-sm text-slate-400">
            This trip does not have enough location data to draw a route.
          </p>
        </div>
      </div>
    );
  }

  const latitudes = validPoints.map((point) => point.latitudeNumber);
  const longitudes = validPoints.map((point) => point.longitudeNumber);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const plottedPoints = validPoints.map((point) => ({
    ...point,
    left: normalize(point.longitudeNumber, minLng, maxLng),
    top: 100 - normalize(point.latitudeNumber, minLat, maxLat),
  }));

  const pathData = plottedPoints
    .map((point, index) =>
      index === 0
        ? `M ${point.left} ${point.top}`
        : `L ${point.left} ${point.top}`
    )
    .join(" ");

  return (
    <div className="relative h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-0 h-full w-px bg-white/20" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-white/20" />
        <div className="absolute left-0 top-1/4 h-px w-full bg-white/20" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/20" />
        <div className="absolute left-0 top-3/4 h-px w-full bg-white/20" />
      </div>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {plottedPoints.length > 1 && (
          <path
            d={pathData}
            stroke="#60a5fa"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 2"
          />
        )}
      </svg>

      {plottedPoints.map((point, index) => (
        <div
          key={point.id || `${getPointLabel(point, index)}-${index}`}
          className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-300 text-xs font-bold text-blue-950 shadow-[0_0_24px_8px_rgba(147,197,253,0.45)]"
          style={{
            left: `${point.left}%`,
            top: `${point.top}%`,
          }}
          title={`${getPointLabel(point, index)}: ${point.latitude}, ${point.longitude}`}
        >
          {index + 1}
        </div>
      ))}

      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
        <p className="text-sm text-slate-300">Generated route preview</p>
        <p className="font-semibold">
          {plottedPoints.length} mapped photo point
          {plottedPoints.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}