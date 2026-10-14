import React, { useState } from 'react';
import { Building, MapPin, CheckCircle, Settings } from 'lucide-react';

export function InstitutionDepartmentsView() {
  const [depts] = useState([
    { id: 'dept-cs', name: 'Computer Science & Engineering', head: 'Dr. Alan Vance', members: 42, activeChallenges: 4, schedule: 'Lab Twilight HVAC Eco-Set (20:00 - 06:00)' },
    { id: 'dept-env', name: 'School of Environmental Science', head: 'Prof. Martha Chen', members: 28, activeChallenges: 6, schedule: 'Living Lab Arboretum Continuous' },
    { id: 'dept-arch', name: 'School of Architecture & Urban Design', head: 'Dr. Liam Kelly', members: 31, activeChallenges: 3, schedule: 'Daylight Passive Ventilation Mode' },
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Campus Academic Departments & Operational Facilities</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Administrative roster of academic units, faculty moderators, and facility operating schedules.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {depts.map(d => (
          <div key={d.id} className="p-3.5 rounded bg-neutral-900 border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">{d.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {d.activeChallenges} Active Challenges
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 bg-neutral-950 p-2 rounded">
              <div><span className="text-neutral-500">Department Lead: </span><span className="text-white">{d.head}</span> ({d.members} members)</div>
              <div><span className="text-neutral-500">Operating Policy: </span><span className="text-teal-400">{d.schedule}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstitutionGeofenceView() {
  const [geofence] = useState({
    campusName: 'Verdia Central Campus Core',
    coordinates: 'Lat 47.6062° N, Long 122.3321° W (Radius: 1,200m)',
    activeZones: ['Main Quadrangle Living Lab', 'Dormitory Eco-Village', 'Athletics & Solar Canopy Complex'],
    boundaryType: 'Opt-in Geo-Challenge Verification Perimeter',
  });

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-emerald-400" />
        <span>Campus Geographic Boundary & Challenge Geofence</span>
      </h2>
      <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-3">
        <div className="flex justify-between font-semibold text-white">
          <span>{geofence.campusName}</span>
          <span className="text-emerald-400 font-mono">{geofence.coordinates}</span>
        </div>
        <div className="text-[11px] text-neutral-400">{geofence.boundaryType}</div>
        <div className="border-t border-white/5 pt-2">
          <div className="text-[11px] font-semibold text-neutral-300 mb-1.5">Active Sustainability Zones:</div>
          <div className="flex gap-2">
            {geofence.activeZones.map((z, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-neutral-300 text-[10px]">
                {z}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstitutionVerifyView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
        <span>Institution Environmental Audit & Verification Portal</span>
      </h2>
      <div className="p-4 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
        <div className="flex justify-between text-white font-semibold">
          <span>Official 2025-2026 Campus Energy Attestation</span>
          <span className="text-emerald-400 font-mono">STATUS: CERTIFIED</span>
        </div>
        <p className="text-[11px] text-neutral-300 leading-relaxed">
          Electricity meter intake totals cryptographically signed and cross-referenced with regional grid carbon factor (0.42 kg CO₂e/kWh).
        </p>
      </div>
    </div>
  );
}

export function InstitutionIotView() {
  const [sensors] = useState([
    { id: 'iot-01', location: 'Science Complex Substation', metric: 'Main Feeder 480V', liveVal: '342.6 kW', status: 'Online', pwrFactor: '0.98 PF', updated: '2s ago' },
    { id: 'iot-02', location: 'Rainwater Retention Vault B', metric: 'Ultrasonic Depth', liveVal: '84.2% (142 kL)', status: 'Online', pwrFactor: 'Flow: 12 L/min', updated: '5s ago' },
    { id: 'iot-03', location: 'Engineering Annex Chiller', metric: 'Thermal Delta-T', liveVal: '6.4°C Chilled Loop', status: 'Online', pwrFactor: 'COP 4.2', updated: 'Just now' },
    { id: 'iot-04', location: 'Student Union Composting Station', metric: 'Load Cell Array', liveVal: '1,280 kg Accumulated', status: 'Online', pwrFactor: 'Diversion 91%', updated: '12s ago' },
    { id: 'iot-05', location: 'Rooftop Solar Array Array-4', metric: 'Inverter Output', liveVal: '88.4 kW Gen', status: 'Online', pwrFactor: 'Irradiance: 840 W/m²', updated: 'Just now' },
    { id: 'iot-06', location: 'Athletics EV Fleet Hub', metric: 'Charge Rate Demand', liveVal: '44.0 kW (6 vehicles)', status: 'Active', pwrFactor: 'Smart Throttled', updated: '15s ago' }
  ]);

  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Campus Telemetry, IoT Sub-Meters & Building Automation</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Real-time BACnet, Modbus, and MQTT IoT endpoints transmitting high-frequency campus utility telemetry into MongoDB Atlas.
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
          6/6 NODES SYNCHRONIZED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sensors.map((s) => (
          <div key={s.id} className="p-3.5 rounded-lg bg-neutral-900 border border-white/5 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-white">{s.location}</div>
                <div className="text-[11px] text-neutral-400 font-mono">{s.id} · {s.metric}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
                {s.status}
              </span>
            </div>
            <div className="flex justify-between items-center bg-neutral-950 p-2.5 rounded border border-white/5">
              <span className="text-base font-bold text-white font-mono">{s.liveVal}</span>
              <div className="text-right">
                <div className="text-[10px] text-neutral-400">{s.pwrFactor}</div>
                <div className="text-[9px] text-neutral-500 font-mono">{s.updated}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstitutionSettingsView() {
  return (
    <div className="fluent-card p-5 space-y-4 text-xs">
      <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
        <Settings className="w-4 h-4 text-emerald-400" />
        <span>Institution Sustainability Target Settings & ESG Parameters</span>
      </h2>
      <div className="space-y-2">
        <div className="p-3.5 rounded bg-neutral-900 border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-semibold text-white">Campus Target: 25% Waste Diversion Increase by 2028</div>
            <div className="text-[11px] text-neutral-400">Institutional ESG Committee Approved Policy</div>
          </div>
          <span className="font-mono text-emerald-400 font-bold">In Progress</span>
        </div>
      </div>
    </div>
  );
}
