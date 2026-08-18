// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatGauge } from '@/components/ui/StatGauge';
import {
  MapPin,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  Layers,
  FileCode,
  Sliders,
  Check,
  Search,
} from 'lucide-react';
import { GeofencePolygon } from '@/lib/services/institutionService';

export default function GeofenceEditorPage() {
  const [geofence, setGeofence] = useState<GeofencePolygon>(() => ([] as any));
  const [vertices, setVertices] = useState<Array<{ lat: number; lng: number }>>(() => []);
  const [bufferMeters, setBufferMeters] = useState<number>(() => 0);
  const [testLat, setTestLat] = useState<string>('37.7749');
  const [testLng, setTestLng] = useState<string>('-122.4194');
  const [testResult, setTestResult] = useState<{ inside: boolean; distanceMeters: number } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  if (!geofence) return null;

  // Calculate centroid & area dynamically
  const calcCentroid = (verts: Array<{ lat: number; lng: number }>) => {
    if (verts.length === 0) return { lat: 37.774, lng: -122.418 };
    const sumLat = verts.reduce((acc, v) => acc + v.lat, 0);
    const sumLng = verts.reduce((acc, v) => acc + v.lng, 0);
    return {
      lat: Number((sumLat / verts.length).toFixed(6)),
      lng: Number((sumLng / verts.length).toFixed(6)),
    };
  };

  const safeVertices = Array.isArray(vertices) && vertices.length > 0 ? vertices : [
    { lat: 37.7749, lng: -122.4194 },
    { lat: 37.7758, lng: -122.4180 },
    { lat: 37.7735, lng: -122.4160 },
    { lat: 37.7720, lng: -122.4185 },
  ];

  const currentCentroid = calcCentroid(safeVertices);

  // SVG Mapping projection math for rendering Spatial Canvas
  const minLat = Math.min(...safeVertices.map((v) => v?.lat ?? 37.770), 37.770);
  const maxLat = Math.max(...safeVertices.map((v) => v?.lat ?? 37.780), 37.780);
  const minLng = Math.min(...safeVertices.map((v) => v?.lng ?? -122.425), -122.425);
  const maxLng = Math.max(...safeVertices.map((v) => v?.lng ?? -122.410), -122.410);

  const mapWidth = 500;
  const mapHeight = 350;

  const projectToCanvas = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 80) + 40;
    const y = mapHeight - (((lat - minLat) / (maxLat - minLat)) * (mapHeight - 80) + 40);
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  };

  const polygonPointsString = safeVertices
    .map((v) => {
      const p = projectToCanvas(v.lat, v.lng);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  const centroidPoint = projectToCanvas(currentCentroid.lat, currentCentroid.lng);

  // Event Handlers
  const handleVertexChange = (index: number, field: 'lat' | 'lng', val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    const newVerts = [...vertices];
    newVerts[index][field] = num;
    setVertices(newVerts);
  };

  const handleAddVertex = () => {
    const last = vertices[vertices.length - 1] || { lat: 37.774, lng: -122.418 };
    setVertices([...vertices, { lat: last.lat + 0.001, lng: last.lng + 0.001 }]);
  };

  const handleRemoveVertex = (index: number) => {
    if (vertices.length <= 3) {
      alert('Geofence polygon requires a minimum of 3 vertices to define a valid enclosed area.');
      return;
    }
    setVertices(vertices.filter((_, i) => i !== index));
  };

  const handleRunGeoWithinTest = () => {
    const lat = parseFloat(testLat);
    const lng = parseFloat(testLng);
    if (isNaN(lat) || isNaN(lng)) return;
    const result = ([] as any);
    setTestResult(result);
  };

  const handleSaveGeofence = () => {
    const updated = ([] as any);
    setGeofence(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const geoJsonStructure = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [...safeVertices.map((v) => [v.lng, v.lat]), [safeVertices[0].lng, safeVertices[0].lat]],
      ],
    },
    properties: {
      id: geofence.id,
      name: geofence.name,
      bufferMeters,
      centroid: currentCentroid,
      indexType: '2dsphere',
      mongoDbQueryPattern: '$geoWithin: { $geometry: { type: "Polygon", coordinates: [...] } }',
    },
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/90 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-emerald-800" />
              <Badge variant="emerald">Spatial Canvas Engine</Badge>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-mono">MongoDB 2dsphere GeoJSON</span>
            </div>
            <h1 className="font-editorial text-2xl font-bold text-stone-900">
              Interactive Geofence Polygon Editor
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Draw, drag & adjust campus perimeter boundaries. Enforces $geoWithin verification checks for all sub-tier action claims.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJsonModal(true)}
              className="gap-1.5 text-xs text-stone-700"
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Export GeoJSON</span>
            </Button>
            <Button
              variant="emerald"
              size="sm"
              onClick={handleSaveGeofence}
              className="gap-1.5 text-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Spatial Boundary</span>
            </Button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            <span>
              Geofence polygon updated successfully! MongoDB 2dsphere spatial indexes updated for all campus departments.
            </span>
          </div>
        )}

        {/* Canvas & Controls Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Spatial Canvas Map Display */}
          <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-800" />
                <h2 className="text-sm font-bold text-stone-900">Campus Spatial Vector Canvas</h2>
              </div>
              <Badge variant="emerald">2dsphere Polygon Active</Badge>
            </div>

            {/* SVG Visual Polygon Map */}
            <div className="relative bg-stone-900 rounded-xl border border-stone-800 overflow-hidden min-h-[360px] flex items-center justify-center p-2">
              {/* Background Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(#10b981 0.75px, transparent 0.75px), radial-gradient(#10b981 0.75px, #0f172a 0.75px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }}
              />

              <svg width={mapWidth} height={mapHeight} className="relative z-10 w-full h-full max-h-[360px]">
                {/* Polygon Buffer Area */}
                <polygon
                  points={polygonPointsString}
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />

                {/* Main Enclosed Polygon */}
                <polygon
                  points={polygonPointsString}
                  fill="rgba(6, 78, 59, 0.35)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="none"
                />

                {/* Polygon Vertices Points */}
                {vertices.map((v, i) => {
                  const p = projectToCanvas(v.lat, v.lng);
                  return (
                    <g key={i} className="cursor-pointer group">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="#064e3b"
                        stroke="#34d399"
                        strokeWidth="2"
                      />
                      <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" />
                      <text
                        x={p.x + 12}
                        y={p.y + 4}
                        fill="#a7f3d0"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        V{i + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Centroid Pin */}
                <g>
                  <circle
                    cx={centroidPoint.x}
                    cy={centroidPoint.y}
                    r="5"
                    fill="#f43f5e"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={centroidPoint.x + 10}
                    y={centroidPoint.y - 6}
                    fill="#fda4af"
                    fontSize="9"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    Centroid (Main Bld)
                  </text>
                </g>

                {/* Test Evaluated Point if available */}
                {testResult && (
                  <g>
                    {(() => {
                      const tp = projectToCanvas(parseFloat(testLat), parseFloat(testLng));
                      return (
                        <>
                          <circle
                            cx={tp.x}
                            cy={tp.y}
                            r="6"
                            fill={testResult.inside ? '#10b981' : '#f43f5e'}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={tp.x + 10}
                            y={tp.y + 4}
                            fill={testResult.inside ? '#a7f3d0' : '#fecdd3'}
                            fontSize="10"
                            fontWeight="bold"
                          >
                            Test Point: {testResult.inside ? 'INSIDE' : 'OUTSIDE'}
                          </text>
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>

              {/* Map Footer Overlay Stats */}
              <div className="absolute bottom-3 left-3 right-3 bg-stone-900/90 backdrop-blur-md border border-stone-800 p-2.5 rounded-lg flex items-center justify-between text-[11px] text-stone-300">
                <div>
                  <span className="text-stone-400">Centroid: </span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {currentCentroid.lat}, {currentCentroid.lng}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400">Total Vertices: </span>
                  <span className="font-mono font-bold text-white">{vertices.length}</span>
                </div>
                <div>
                  <span className="text-stone-400">Buffer Zone: </span>
                  <span className="font-mono font-bold text-amber-400">{bufferMeters}m</span>
                </div>
              </div>
            </div>

            {/* Live $geoWithin Test Tool */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/90 space-y-3">
              <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-800" />
                <span>MongoDB $geoWithin Spatial Containment Tester</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 font-medium block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={testLat}
                    onChange={(e) => setTestLat(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 font-medium block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={testLng}
                    onChange={(e) => setTestLng(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={handleRunGeoWithinTest}
                    className="w-full text-xs gap-1"
                  >
                    <Search className="h-3 w-3" />
                    <span>Run Query</span>
                  </Button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    testResult.inside
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.inside ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-700" />
                    )}
                    <div>
                      <span className="font-bold">
                        {testResult.inside ? 'POINT INSIDE CAMPUS GEOFENCE' : 'POINT OUTSIDE CAMPUS GEOFENCE'}
                      </span>
                      <p className="text-[10px] opacity-80">
                        Distance to centroid: {testResult.distanceMeters} meters
                      </p>
                    </div>
                  </div>
                  <Badge variant={testResult.inside ? 'emerald' : 'rose'}>
                    {testResult.inside ? 'PASSED' : 'OUT_OF_BOUNDS'}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Vertex Coordinate Editor Table */}
          <div className="lg:col-span-5 bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-stone-900">Vertex Coordinates</h2>
                <p className="text-[11px] text-stone-500">Edit boundary GPS points in order</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddVertex} className="gap-1 text-xs">
                <Plus className="h-3 w-3" />
                <span>Add Point</span>
              </Button>
            </div>

            {/* Buffer & Tolerance Settings */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-stone-700">Geofence Buffer Distance</span>
                <span className="font-mono font-bold text-emerald-900">{bufferMeters} meters</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={bufferMeters}
                onChange={(e) => setBufferMeters(parseInt(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <p className="text-[10px] text-stone-500">
                Action claims within {bufferMeters}m of perimeter are flagged as &apos;borderline&apos; for IsolationForest verification.
              </p>
            </div>

            {/* Vertex List */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {vertices.map((v, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-stone-50/80 border border-stone-200/80 rounded-xl flex items-center justify-between gap-2"
                >
                  <span className="text-xs font-mono font-bold text-stone-600 min-w-[24px]">V{idx + 1}</span>
                  <div className="grid grid-cols-2 gap-1.5 flex-1">
                    <input
                      type="number"
                      step="0.0001"
                      value={v.lat}
                      onChange={(e) => handleVertexChange(idx, 'lat', e.target.value)}
                      className="px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono"
                      placeholder="Lat"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={v.lng}
                      onChange={(e) => handleVertexChange(idx, 'lng', e.target.value)}
                      className="px-2 py-1 bg-white border border-stone-300 rounded text-xs font-mono"
                      placeholder="Lng"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveVertex(idx)}
                    className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              variant="emerald"
              size="sm"
              onClick={handleSaveGeofence}
              className="w-full text-xs gap-1.5 pt-2"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Apply Boundary Changes</span>
            </Button>
          </div>
        </div>

        {/* Modal: View GeoJSON Structure */}
        {showJsonModal && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-emerald-800" />
                  <span>GeoJSON 2dsphere Spatial Schema</span>
                </h3>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <pre className="p-3 bg-stone-950 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto max-h-[300px]">
                {JSON.stringify(geoJsonStructure, null, 2)}
              </pre>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(geoJsonStructure, null, 2));
                    alert('GeoJSON copied to clipboard!');
                  }}
                  className="text-xs"
                >
                  Copy JSON
                </Button>
                <Button variant="emerald" size="sm" onClick={() => setShowJsonModal(false)} className="text-xs">
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
