import { useEffect, useState } from 'react';
import { fetchWeather, describeWeatherCode } from '../lib/weather';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * WeatherWidget — live conditions + a 5-day forecast for a place, via Open-Meteo.
 *
 * `lat`/`lng` collapse into a single `coordsKey`, so the effect re-runs only when the location
 * actually changes. The response is stored *with the coordinates it belongs to* and compared
 * against the current ones during render, so a slow response for place A can never overwrite
 * place B's weather and there is no "reset to loading" state update inside the effect.
 */
export default function WeatherWidget({ lat, lng, placeName }) {
  const coordsKey = typeof lat === 'number' && typeof lng === 'number' ? `${lat},${lng}` : null;
  const [result, setResult] = useState(null); // { coordsKey, data }

  const resolved = Boolean(coordsKey) && result?.coordsKey === coordsKey;
  const weather = resolved ? result.data : null;

  useEffect(() => {
    if (!coordsKey) return;

    // Deliberately no AbortController. `fetchWeather` de-duplicates identical in-flight
    // requests, so aborting on unmount made the next caller await the already-failed shared
    // promise — under StrictMode's double-mount that latched this widget to "no data" and hid
    // it on every page. The `coordsKey` tag below already makes late responses harmless.
    fetchWeather(lat, lng).then((data) => setResult({ coordsKey, data: data ?? null }));
  }, [coordsKey, lat, lng]);

  // No coordinates, or the service had nothing — just don't show the widget rather than
  // showing an error, since this is a nice-to-have rather than core content.
  if (!coordsKey || (resolved && !weather)) return null;

  if (!weather) {
    return (
      <div className="rounded-2xl border border-black/10 bg-surface p-5 shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10">
        <div className="skeleton h-5 w-32 rounded-full" />
        <div className="skeleton mt-3 h-10 w-20 rounded-lg" />
      </div>
    );
  }

  const [label, icon] = describeWeatherCode(weather.current.code);

  return (
    <div className="rounded-2xl border border-black/10 bg-surface p-5 shadow-[0_2px_8px_rgba(31,58,95,0.06)] dark:border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60">
            Weather in {placeName} now
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-[2.2rem] leading-none text-indigo dark:text-charcoal">
              {weather.current.temp}°C
            </span>
            <span className="text-[0.9rem]">{label}</span>
          </div>
          <div className="mt-1 text-[0.78rem] opacity-65">
            Humidity {weather.current.humidity}% · Wind {weather.current.wind} km/h
          </div>
        </div>
        <div className="text-[2.4rem]" aria-hidden="true">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex justify-between gap-1 border-t border-black/10 pt-3.5 dark:border-white/10">
        {weather.daily.slice(0, 5).map((day) => {
          const [, dayIcon] = describeWeatherCode(day.code);
          return (
            <div key={day.date} className="flex flex-col items-center gap-1 text-[0.72rem]">
              <span className="font-bold opacity-70">{DAY_LABELS[new Date(day.date).getDay()]}</span>
              <span aria-hidden="true">{dayIcon}</span>
              <span>
                {day.max}°<span className="opacity-50">/{day.min}°</span>
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[0.68rem] italic opacity-50">Live weather via Open-Meteo</p>
    </div>
  );
}
