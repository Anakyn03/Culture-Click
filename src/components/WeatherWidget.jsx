import { useEffect, useState } from 'react';
import { fetchWeather, describeWeatherCode } from '../lib/weather';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WeatherWidget({ lat, lng, placeName }) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | unavailable

  useEffect(() => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      setStatus('unavailable');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    fetchWeather(lat, lng, { signal: controller.signal }).then((data) => {
      if (controller.signal.aborted) return;
      if (!data) { setStatus('unavailable'); return; }
      setWeather(data);
      setStatus('ok');
    });
    return () => controller.abort();
  }, [lat, lng]);

  if (status === 'unavailable') return null; // nice-to-have — just don't show it rather than showing an error

  if (status === 'loading') {
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
          <div className="text-[0.72rem] font-bold uppercase tracking-wide opacity-60">Weather in {placeName} now</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-serif text-[2.2rem] leading-none text-indigo dark:text-charcoal">{weather.current.temp}°C</span>
            <span className="text-[0.9rem]">{label}</span>
          </div>
          <div className="mt-1 text-[0.78rem] opacity-65">Humidity {weather.current.humidity}% · Wind {weather.current.wind} km/h</div>
        </div>
        <div className="text-[2.4rem]" aria-hidden="true">{icon}</div>
      </div>

      <div className="mt-4 flex justify-between gap-1 border-t border-black/10 pt-3.5 dark:border-white/10">
        {weather.daily.slice(0, 5).map((d) => {
          const [, dayIcon] = describeWeatherCode(d.code);
          const day = DAY_LABELS[new Date(d.date).getDay()];
          return (
            <div key={d.date} className="flex flex-col items-center gap-1 text-[0.72rem]">
              <span className="font-bold opacity-70">{day}</span>
              <span aria-hidden="true">{dayIcon}</span>
              <span>{d.max}°<span className="opacity-50">/{d.min}°</span></span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[0.68rem] italic opacity-50">Live weather via Open-Meteo</p>
    </div>
  );
}
