type LocationMatch = {
  name: string;
  latitude: number;
  longitude: number;
  radiusMiles: number;
};

const knownLocations: LocationMatch[] = [
  {
    name: "Paris, France",
    latitude: 48.8566,
    longitude: 2.3522,
    radiusMiles: 40,
  },
  {
    name: "Metz, France",
    latitude: 49.1193,
    longitude: 6.1757,
    radiusMiles: 35,
  },
  {
    name: "Zurich, Switzerland",
    latitude: 47.3769,
    longitude: 8.5417,
    radiusMiles: 40,
  },
  {
    name: "Atlanta, Georgia",
    latitude: 33.749,
    longitude: -84.388,
    radiusMiles: 45,
  },
  {
    name: "Melbourne, Florida",
    latitude: 28.0836,
    longitude: -80.6081,
    radiusMiles: 45,
  },
  {
    name: "New York City, New York",
    latitude: 40.7128,
    longitude: -74.006,
    radiusMiles: 45,
  },
  {
    name: "London, United Kingdom",
    latitude: 51.5072,
    longitude: -0.1276,
    radiusMiles: 45,
  },
  {
    name: "Rome, Italy",
    latitude: 41.9028,
    longitude: 12.4964,
    radiusMiles: 45,
  },
  {
    name: "Barcelona, Spain",
    latitude: 41.3874,
    longitude: 2.1686,
    radiusMiles: 45,
  },
  {
    name: "Amsterdam, Netherlands",
    latitude: 52.3676,
    longitude: 4.9041,
    radiusMiles: 45,
  },
];

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

export function getLocationName(latitude: number, longitude: number) {
  const match = knownLocations.find((location) => {
    const distance = calculateDistanceMiles(
      latitude,
      longitude,
      location.latitude,
      location.longitude
    );

    return distance <= location.radiusMiles;
  });

  if (match) {
    return match.name;
  }

  return "Unnamed Travel Stop";
}