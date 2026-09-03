// Open-Meteo: https://open-meteo.com — free for non-commercial and most commercial use, no API
// key, no rate-limit headaches for a project this size. Called directly from the browser; if this
// ever needs to move behind a server (e.g. to add caching), it's a one-function swap.

// WMO weather codes -> a short label + emoji icon. Not exhaustive-fancy, just readable.
const WMO_CODES = {
  0: ['Clear sky', '☀️'], 1: ['Mainly clear', '🌤️'], 2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'], 48: ['Depositing rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'], 53: ['Drizzle', '🌦️'], 55: ['Dense drizzle', '🌦️'],
  61: ['Light rain', '🌧️'], 63: ['Rain', '🌧️'], 65: ['Heavy rain', '🌧️'],
  71: ['Light snow', '🌨️'], 73: ['Snow', '🌨️'], 75: ['Heavy snow', '🌨️'],
  80: ['Rain showers', '🌦️'], 81: ['Rain showers', '🌦️'], 82: ['Violent rain showers', '⛈️'],
  95: ['Thunderstorm', '⛈️'], 96: ['Thunderstorm with hail', '⛈️'], 99: ['Thunderstorm with hail', '⛈️'],
};
export function describeWeatherCode(code) {
  return WMO_CODES[code] || ['—', '🌡️'];
}

/**
 * Fetches current conditions + a short daily forecast for a lat/lng.
 * Returns null on any failure — callers should treat that as "weather unavailable" and hide
 * the widget rather than showing an error, since this is a nice-to-have, not core content.
 */
export async function fetchWeather(lat, lng, { signal } = {}) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    current: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
    forecast_days: '5',
  });
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      current: {
        temp: Math.round(data.current.temperature_2m),
        code: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
      },
      daily: data.daily.time.map((date, i) => ({
        date,
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i]),
        code: data.daily.weather_code[i],
      })),
    };
  } catch {
    return null; // network error, aborted request, etc. — fail silently, it's a nice-to-have
  }
}
