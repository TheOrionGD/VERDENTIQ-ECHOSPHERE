import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Play, 
  TrendingUp, 
  Sparkles, 
  Sliders 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { apiRequest } from '../../lib/api';

import { useAuth } from '../../lib/useAuth';
import { MlopsLlmGatewayView } from './mlops/MlopsLlmGatewayView';
import { MlopsDataPipelineView } from './mlops/MlopsDataPipelineView';
import { MlopsAlertsView } from './mlops/MlopsAlertsView';
import { MlopsRegistryDiffView } from './mlops/MlopsRegistryDiffView';
import { MlopsCanaryView } from './mlops/MlopsCanaryView';
import { MlopsFallbackConsoleView } from './mlops/MlopsFallbackConsoleView';
import { MlopsSettingsView } from './mlops/MlopsSettingsView';
import { MlopsModelsView } from './mlops/MlopsModelsView';
import { MlopsOptimizerView } from './mlops/MlopsOptimizerView';
import { MlopsExperimentsView } from './mlops/MlopsExperimentsView';

export function MlopsDashboard() {
  const { activeScreen } = useAuth();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Model parameters
  const [alpha, setAlpha] = useState(0.4);
  const [beta, setBeta] = useState(0.2);

  // AI Diagnostic
  const [aiCommentary, setAiCommentary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const forecastRes = await apiRequest('/api/mlops/forecast', {
          method: 'POST',
          body: { institutionId: 'inst-verdia-central', alpha: 0.4, beta: 0.2 },
        });
        if (isMounted) {
          setForecastData(forecastRes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleRunForecast = async () => {
    try {
      setLoading(true);
      const res = await apiRequest('/api/mlops/forecast', {
        method: 'POST',
        body: { institutionId: 'inst-verdia-central', alpha, beta },
      });
      setForecastData(res);
    } catch (err) {
      alert(`Forecast error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAiDiagnostic = async () => {
    if (!forecastData) return;
    try {
      setAiLoading(true);
      const res = await apiRequest('/api/mlops/ai-diagnostic', {
        method: 'POST',
        body: {
          actuals: forecastData.historicalSeries.map(h => h.kwh),
          forecasts: forecastData.futureForecasts.map(f => f.forecastKwh),
          metrics: forecastData.evaluationMetrics,
        },
      });
      setAiCommentary(res.commentary);
    } catch (err) {
      alert(`AI Diagnostic error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Prepare combined forecast chart data
  const chartPoints = [];
  if (forecastData) {
    forecastData.historicalSeries.forEach((h, idx) => {
      chartPoints.push({
        period: h.period,
        actual: h.kwh,
        fitted: forecastData.fittedHistory[idx] || null,
        type: 'Recorded',
      });
    });

    forecastData.futureForecasts.forEach((f) => {
      chartPoints.push({
        period: `+${f.step}M Forecast`,
        forecast: f.forecastKwh,
        lowerBound: f.lowerBoundKwh,
        upperBound: f.upperBoundKwh,
        type: 'Projection',
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>MLOps Forecasting & Pareto Optimization Suite</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Statistical Time-Series Demand Forecasting · Multi-Objective Pareto Frontier Solvers (Pure JS)
          </p>
        </div>

        <button
          onClick={handleRunAiDiagnostic}
          disabled={aiLoading}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>{aiLoading ? 'Diagnosing...' : 'AI Model Variance Diagnostics'}</span>
        </button>
      </div>

      {/* Screen 1: ML Center Overview */}
      {(activeScreen === 'mlops-dashboard' || activeScreen === 'dashboard') && (
        <>
          {loading && !forecastData && (
            <div className="fluent-card p-8 text-center text-xs text-neutral-400 animate-pulse">
              Computing Holt-Winters model fitted points and forecast projections...
            </div>
          )}
          {/* Model Metrics Cards */}
          {forecastData?.evaluationMetrics && (
            <div className="grid grid-cols-4 gap-4">
              <div className="fluent-card p-4">
                <div className="text-xs text-neutral-400 mb-1">Mean Absolute Error (MAE)</div>
                <div className="text-2xl font-bold text-white">
                  {forecastData.evaluationMetrics.mae?.toLocaleString()} <span className="text-xs font-normal text-neutral-400">kWh</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Average deviation across history</div>
              </div>

              <div className="fluent-card p-4">
                <div className="text-xs text-neutral-400 mb-1">Root Mean Squared Error (RMSE)</div>
                <div className="text-2xl font-bold text-white">
                  {forecastData.evaluationMetrics.rmse?.toLocaleString()} <span className="text-xs font-normal text-neutral-400">kWh</span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Penalizes large errors</div>
              </div>

              <div className="fluent-card p-4">
                <div className="text-xs text-neutral-400 mb-1">Mean Absolute % Error (MAPE)</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {forecastData.evaluationMetrics.mape}%
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">High statistical reliability</div>
              </div>

              <div className="fluent-card p-4">
                <div className="text-xs text-neutral-400 mb-1">Historical Samples</div>
                <div className="text-2xl font-bold text-white">
                  {forecastData.evaluationMetrics.sampleSize} Months
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">Campus billing history</div>
              </div>
            </div>
          )}

          {/* AI Diagnostic Commentary */}
          {aiCommentary && (
            <div className="fluent-card p-4 border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Model Diagnostic Analysis (Gemini / Groq)</span>
              </div>
              <p className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">{aiCommentary}</p>
            </div>
          )}

          {/* Forecast Chart & Parameter Tuning */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 fluent-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Demand Forecast: Historical Actuals vs Projected Months</span>
                  </h2>
                  <p className="text-[11px] text-neutral-400">Holt-Winters level and trend smoothing projections</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartPoints}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="period" stroke="#888" fontSize={10} />
                    <YAxis stroke="#888" fontSize={10} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', fontSize: '11px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Actual (Recorded)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="fitted" name="Model Fitted" stroke="#a78bfa" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="forecast" name="Projected Forecast" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Forecast Tuner Card */}
            <div className="fluent-card p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center space-x-2 mb-1">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Hyperparameter Tuning</span>
                </h2>
                <p className="text-[11px] text-neutral-400 mb-4">Recompute forecast smoothing weights in pure JS</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-1">
                      <span>Level Smoothing (Alpha):</span>
                      <span className="font-mono text-emerald-400">{alpha}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={alpha}
                      onChange={(e) => setAlpha(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-neutral-300 mb-1">
                      <span>Trend Smoothing (Beta):</span>
                      <span className="font-mono text-emerald-400">{beta}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={beta}
                      onChange={(e) => setBeta(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleRunForecast}
                    className="w-full py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Re-Execute Forecast Model</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Screen 2: Model Registry */}
      {activeScreen === 'models' && <MlopsModelsView />}

      {/* Screen 3: Solver Weights & Pareto Optimizer */}
      {activeScreen === 'optimizer' && <MlopsOptimizerView />}

      {/* Screen 4: LLM Gateway */}
      {activeScreen === 'llm-gateway' && <MlopsLlmGatewayView />}

      {/* Screen 5: Experiments */}
      {activeScreen === 'experiments' && <MlopsExperimentsView />}

      {/* Screen 6: Data Pipeline */}
      {activeScreen === 'data-pipeline' && <MlopsDataPipelineView />}

      {/* Screen 7: Drift Alerts */}
      {activeScreen === 'alerts' && <MlopsAlertsView />}

      {/* Screen 8: Registry Diff */}
      {activeScreen === 'registry-diff' && <MlopsRegistryDiffView />}

      {/* Screen 9: Canary Rollout */}
      {activeScreen === 'canary' && <MlopsCanaryView />}

      {/* Screen 10: Fallback Console */}
      {activeScreen === 'fallback-console' && <MlopsFallbackConsoleView />}

      {/* Screen 11: Governance Settings */}
      {activeScreen === 'settings' && <MlopsSettingsView />}
    </div>
  );
}
