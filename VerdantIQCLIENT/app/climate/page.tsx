'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { RoleSubNav } from '@/components/shell/RoleSubNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Compass,
  AlertTriangle,
  Waves,
  ShieldAlert,
  Sparkles,
  MapPin,
  Search,
  RefreshCw,
  Gauge,
  Thermometer,
  TreePine,
  Activity,
  ArrowUp,
  ArrowDown,
  Navigation,
} from 'lucide-react';
import { ClimatePlatformData } from '@/app/api/climate/route';

export default function ClimateDataPlatformPage() {
  const [climate, setClimate] = useState<ClimatePlatformData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchCity, setSearchCity] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily' | 'flood' | 'esg'>('hourly');

  const fetchClimateData = async (params?: { lat?: number; lon?: number; city?: string }) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (params?.lat && params?.lon) {
        q.append('lat', params.lat.toString());
        q.append('lon', params.lon.toString());
      } else if (params?.city) {
        q.append('city', params.city);
      }

      const res = await fetch(`/api/climate?${q.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setClimate(json.data);
      }
    } catch (e) {
      console.error('Failed to load climate data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Attempt browser high-precision GPS first; fall back to server IP geolocation
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchClimateData({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (_err) => {
          // If browser GPS permission denied/unavailable, backend auto-detects from IP (Salem, TN, India)
          fetchClimateData();
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      fetchClimateData();
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          fetchClimateData({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          setIsLocating(false);
          console.warn('Geolocation blocked or unavailable, falling back to IP detection:', err.message);
          fetchClimateData();
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      fetchClimateData();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchClimateData({ city: searchCity.trim() });
    }
  };

  if (!climate && loading) {
    return (
      <AppShell>
        <div className="space-y-6 font-sans">
          <RoleSubNav />
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="h-8 w-8 text-emerald-700 animate-spin mx-auto" />
            <h2 className="text-base font-bold text-stone-800">
              Connecting to Climate &amp; Hydrological Mesh...
            </h2>
            <p className="text-xs text-stone-500 font-mono">
              Aggregating OpenWeather, Open-Meteo High-Res Radar, &amp; Flood Satellites
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const flood = climate?.floodRisk;
  const current = climate?.current;
  const aqi = climate?.airQuality;
  const loc = climate?.location;
  const ghg = climate?.greenhouseGasIndicators;

  return (
    <AppShell>
      <div className="space-y-6 font-sans">
        <RoleSubNav />

        {/* Climate Intelligence Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-br from-emerald-950 via-stone-900 to-slate-950 text-white p-6 rounded-3xl border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent pointer-events-none" />

          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                Global Environmental Climate Grid
              </span>
              <Badge variant="emerald" className="font-mono text-[10px]">
                {climate?.source}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight font-editorial">
              Climate Data &amp; Hydrological Risk Platform
            </h1>
            <p className="text-xs text-stone-300 max-w-xl">
              Real-time atmospheric observations, microclimate forecasting, satellite flood discharge modeling, and global greenhouse gas indicators for institutional risk assessment.
            </p>
          </div>

          {/* Location Search Bar & Live Geolocation Button */}
          <div className="z-10 flex flex-col sm:flex-row items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <Search className="h-3.5 w-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search any global city or address..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </form>

            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchClimateData({ city: 'Samayapuram' })}
              className="bg-stone-900/80 border-stone-700 text-stone-200 hover:bg-stone-800 text-xs font-mono gap-1.5 w-full sm:w-auto"
              title="Pin Samayapuram Campus"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              <span>Samayapuram</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="bg-emerald-950/60 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900 text-xs font-bold gap-1.5 w-full sm:w-auto"
            >
              <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS'}</span>
            </Button>
          </div>
        </div>

        {/* Flood Threat Banner (Hydrological Early Warning Alert) */}
        {flood && (
          <div
            className={`p-4 rounded-2xl border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md ${
              flood.level === 'WARNING'
                ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                : flood.level === 'WATCH'
                ? 'bg-amber-950/40 border-amber-600 text-amber-200'
                : flood.level === 'ADVISORY'
                ? 'bg-blue-950/40 border-blue-600 text-blue-200'
                : 'bg-emerald-950/20 border-emerald-800/80 text-emerald-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 shrink-0">
                <Waves className="h-5 w-5 text-current animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold tracking-wider uppercase text-[10px]">
                    Hydrological Flood Intelligence: {flood.level}
                  </span>
                  <Badge variant={flood.level === 'WARNING' ? 'coral' : flood.level === 'WATCH' ? 'amber' : 'emerald'}>
                    Risk Score: {flood.riskScorePct}%
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-white">{flood.title}</h3>
                <p className="text-[11px] opacity-90 leading-relaxed">{flood.summary}</p>
              </div>
            </div>

            <div className="text-right shrink-0 bg-white/5 p-3 rounded-xl border border-white/10 font-mono text-[11px] space-y-0.5">
              <div>River Catchment: <strong>{flood.riverCatchmentLevelMeters}m</strong></div>
              <div>Peak Discharge: <strong>{flood.maxDischargeCubicMetersPerSec} m³/s</strong></div>
              <div className="text-[10px] opacity-80">{flood.floodZoneCategory}</div>
            </div>
          </div>
        )}

        {/* Primary Weather Canvas: Mobile-App Style Current Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Weather Card (Left Column) */}
          <Card className="lg:col-span-8 p-6 bg-white/95 border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-start sm:items-center gap-2 text-stone-700 text-xs">
                  <MapPin className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="font-bold text-stone-900 text-sm">
                      {loc?.formattedAddress || `${loc?.name}, ${loc?.region} (${loc?.country})`}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-stone-400 mt-1 pl-6 sm:pl-6">
                  Lat: {loc?.lat.toFixed(4)}° &bull; Lon: {loc?.lon.toFixed(4)}° &bull; Elev: {loc?.elevationMeters}m
                </div>
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                Updated: {current?.lastUpdated ? new Date(current.lastUpdated).toLocaleTimeString() : 'Live'}
              </div>
            </div>

            {/* Current Conditions Big Hero */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              <div className="flex items-center gap-5">
                <span className="text-6xl select-none">{current?.icon}</span>
                <div>
                  <div className="text-5xl font-black text-stone-900 font-mono tracking-tight">
                    {current?.tempC}°C
                  </div>
                  <div className="text-sm font-semibold text-stone-600 mt-1">
                    {current?.condition} &bull; Feels like {current?.feelsLikeC}°C
                  </div>
                  <div className="text-xs text-stone-500 font-mono flex items-center gap-2 mt-0.5">
                    <span className="text-emerald-700 flex items-center gap-0.5">
                      <ArrowUp className="h-3 w-3" /> {current?.tempMaxC}°
                    </span>
                    <span className="text-blue-700 flex items-center gap-0.5">
                      <ArrowDown className="h-3 w-3" /> {current?.tempMinC}°
                    </span>
                  </div>
                </div>
              </div>

              {/* Weather Indicators Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto text-xs font-mono">
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Humidity</span>
                  <span className="font-bold text-stone-800">{current?.humidityPct}%</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Wind</span>
                  <span className="font-bold text-stone-800">{current?.windSpeedKmh} km/h {current?.windCompass}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Pressure</span>
                  <span className="font-bold text-stone-800">{current?.pressureHpa} hPa</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">UV Index</span>
                  <span className="font-bold text-stone-800">{current?.uvIndex}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Cloud Cover</span>
                  <span className="font-bold text-stone-800">{current?.cloudCoverPct}%</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Dew Point</span>
                  <span className="font-bold text-stone-800">{current?.dewPointC}°C</span>
                </div>
              </div>
            </div>

            {/* View Mode Tabs (Hourly 24h vs 7-Day Forecast) */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('hourly')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'hourly'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  24-Hour Micro Forecast
                </button>
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'daily'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  7-Day Outlook &amp; Hydrology
                </button>
              </div>

              {/* 24-Hour Scrollable Hourly Cards */}
              {activeTab === 'hourly' && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 font-mono text-xs">
                  {climate?.hourly.map((h, idx) => (
                    <div
                      key={idx}
                      className="min-w-[85px] p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center flex flex-col justify-between space-y-1 shrink-0"
                    >
                      <span className="text-[11px] font-sans text-stone-500 font-semibold">{h.time}</span>
                      <span className="text-2xl my-1">{h.icon}</span>
                      <span className="font-bold text-stone-900 text-sm">{h.tempC}°</span>
                      <span className="text-[10px] text-blue-700 font-bold">
                        {h.popPct > 0 ? `${h.popPct}%` : '0%'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 7-Day Table */}
              {activeTab === 'daily' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] text-stone-500 uppercase">
                      <tr>
                        <th className="p-2.5">Day</th>
                        <th className="p-2.5">Condition</th>
                        <th className="p-2.5 text-right">Rain Probability</th>
                        <th className="p-2.5 text-right">Precipitation</th>
                        <th className="p-2.5 text-right">Flood Risk Level</th>
                        <th className="p-2.5 text-right">Min / Max</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {climate?.daily.map((d, idx) => (
                        <tr key={idx} className="hover:bg-stone-50">
                          <td className="p-2.5 font-sans font-bold text-stone-800">{d.dayName}</td>
                          <td className="p-2.5 flex items-center gap-1.5 font-sans">
                            <span>{d.icon}</span>
                            <span>{d.condition}</span>
                          </td>
                          <td className="p-2.5 text-right text-blue-700 font-bold">{d.popMaxPct}%</td>
                          <td className="p-2.5 text-right text-stone-700">{d.precipitationSumMm} mm</td>
                          <td className="p-2.5 text-right">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ backgroundColor: `${d.floodRiskColor}20`, color: d.floodRiskColor }}
                            >
                              {d.floodRiskLevel}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-bold text-stone-900">
                            {d.tempMinC}° / {d.tempMaxC}°
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>

          {/* Right Column: Air Quality & Global ESG Greenhouse Indicators */}
          <div className="lg:col-span-4 space-y-4">
            {/* Air Quality Index (AQI) Widget */}
            <Card className="p-5 bg-white border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-800" />
                  <h3 className="font-editorial text-sm font-bold text-stone-900">Air Quality &amp; Particulates</h3>
                </div>
                <Badge variant={aqi?.aqi && aqi.aqi < 50 ? 'emerald' : 'amber'}>
                  US AQI {aqi?.aqi}
                </Badge>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold">Health Status</span>
                <span className="text-xl font-black text-emerald-800 font-sans">{aqi?.status}</span>
                <p className="text-[10px] text-stone-500 mt-0.5">Air pollution poses little or no risk to campus community.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">PM2.5</span>
                  <span className="font-bold text-stone-800">{aqi?.pm25} µg/m³</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">PM10</span>
                  <span className="font-bold text-stone-800">{aqi?.pm10} µg/m³</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">Ozone (O₃)</span>
                  <span className="font-bold text-stone-800">{aqi?.ozone} µg/m³</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-400 block font-sans">NO₂</span>
                  <span className="font-bold text-stone-800">{aqi?.nitrogenDioxide} µg/m³</span>
                </div>
              </div>
            </Card>

            {/* Planetary Greenhouse Gas & Climate Indicators */}
            <Card className="p-5 bg-gradient-to-br from-stone-900 to-emerald-950 text-white shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider">Planetary GHG Indicators</h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">UN Benchmark</span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Atmospheric CO₂</span>
                  <span className="font-bold text-amber-400">{ghg?.co2ConcentrationPpm} ppm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Atmospheric CH₄ (Methane)</span>
                  <span className="font-bold text-emerald-400">{ghg?.ch4MethanePpb} ppb</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Sea-Level Anomaly</span>
                  <span className="font-bold text-blue-400">+{ghg?.seaLevelRiseAnomalyMm} mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Global Ocean Heat Anomaly</span>
                  <span className="font-bold text-rose-400">+{ghg?.oceanTempAnomalyC}°C</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800/80 text-[10px] text-stone-400 font-sans leading-relaxed">
                Platform climate records are synchronized with NOAA Mauna Loa Observatories &amp; Copernicus satellite data to validate institutional net-zero targets.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

