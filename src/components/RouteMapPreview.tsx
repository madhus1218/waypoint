type TravelPoint = {
  filename: string;
  latitude: string;
  longitude: string;
  timestamp: string;
};

type RouteMapPreviewProps = {
  points: TravelPoint[];
};

function normalize(value: number, min: number, max: number) {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 80 + 10;
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
    );

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
      index === 0 ? `M ${point.left} ${point.top}` : `L ${point.left} ${point.top}`
    )
    .join(" ");

  return (
    <div className="relative h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={pathData}
          stroke="#60a5fa"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 2"
        />
      </svg>

      {plottedPoints.map((point, index) => (
        <div
          key={`${point.filename}-${index}`}
          className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-300 text-xs font-bold text-blue-950 shadow-[0_0_24px_8px_rgba(147,197,253,0.45)]"
          style={{
            left: `${point.left}%`,
            top: `${point.top}%`,
          }}
          title={`${point.filename}: ${point.latitude}, ${point.longitude}`}
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