'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Zap,
  GraduationCap,
  Building2,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Activity,
  Sparkles,
  RefreshCw,
  Award,
  BarChart3,
  Server,
  Layers,
  Leaf,
  Sliders,
} from 'lucide-react';

export const QuickSummaryWidget: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { user, role, roleConfig } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  // Define role-specific quick summary metrics
  const getRoleMetrics = () => {
    switch (role) {
      case 'student':
        return {
          title: 'Student Sustainability & Dorm Summary',
          badge: 'Founders Hall Block B',
          metrics: [
            {
              label: 'Dorm Energy Score',
              value: '94 / 100',
              change: '+4.2% this month',
              trend: 'up',
              icon: GraduationCap,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 94,
            },
            {
              label: 'Monthly Campus Rank',
              value: '#3 in Dorm League',
              change: 'Top 5% of campus',
              trend: 'up',
              icon: Award,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/30',
              progress: 92,
            },
            {
              label: 'Active Green Sprints',
              value: '3 Sprints Enrolled',
              change: '2 completed this term',
              trend: 'up',
              icon: Sparkles,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/30',
              progress: 75,
            },
            {
              label: 'Carbon Offset Credit',
              value: '142 kg CO₂e',
              change: '-18kg vs prev semester',
              trend: 'up',
              icon: Leaf,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/30',
              progress: 88,
            },
          ],
        };

      case 'admin':
        return {
          title: 'System Administration & Global Load Summary',
          badge: 'Production Infrastructure',
          metrics: [
            {
              label: 'Total System Load',
              value: '34.2%',
              change: 'Optimal operation',
              trend: 'up',
              icon: Server,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 34,
            },
            {
              label: 'Active Tenant Orgs',
              value: '14 Institutions',
              change: '+2 pending approval',
              trend: 'up',
              icon: Building2,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/30',
              progress: 85,
            },
            {
              label: 'Security Audit Rating',
              value: 'A+ (ISO 27001)',
              change: '0 critical vulnerabilities',
              trend: 'up',
              icon: ShieldAlert,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/30',
              progress: 98,
            },
            {
              label: 'Global MongoDB Sync',
              value: '99.99% Uptime',
              change: 'Source of Truth Active',
              trend: 'up',
              icon: Cpu,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10 border-indigo-500/30',
              progress: 99,
            },
          ],
        };

      case 'dept':
        return {
          title: 'Department Moderation & Lab Energy Summary',
          badge: 'Computer Science & Engineering',
          metrics: [
            {
              label: 'Department Energy Score',
              value: '88 / 100',
              change: '+2.8% efficiency',
              trend: 'up',
              icon: Building2,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 88,
            },
            {
              label: 'Active Lab Equipment',
              value: '42 Server Racks',
              change: 'Smart power capped',
              trend: 'up',
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/30',
              progress: 70,
            },
            {
              label: 'Faculty Audit Rate',
              value: '100% Verified',
              change: 'All lab leads compliant',
              trend: 'up',
              icon: CheckCircle2,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/30',
              progress: 100,
            },
            {
              label: 'Student Projects',
              value: '28 Active Teams',
              change: '3 campus awards',
              trend: 'up',
              icon: GraduationCap,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/30',
              progress: 82,
            },
          ],
        };

      case 'institution':
        return {
          title: 'Institutional Campus Grid & Tenant Summary',
          badge: 'University Campus Headquarters',
          metrics: [
            {
              label: 'Campus Microgrid Efficiency',
              value: '91.4%',
              change: '+5.1% solar yield',
              trend: 'up',
              icon: Building2,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 91,
            },
            {
              label: 'Enrolled Students',
              value: '4,250 Verified IDs',
              change: '98% Brevo OTP verified',
              trend: 'up',
              icon: GraduationCap,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/30',
              progress: 98,
            },
            {
              label: 'Scope 1 & 2 Offsets',
              value: '1,840 Tons CO₂',
              change: 'On track for 2030 target',
              trend: 'up',
              icon: Leaf,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/30',
              progress: 84,
            },
            {
              label: 'DNS Domain Status',
              value: 'Verified .EDU DNS',
              change: 'Active tenant registry',
              trend: 'up',
              icon: CheckCircle2,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10 border-indigo-500/30',
              progress: 100,
            },
          ],
        };

      case 'region':
        return {
          title: 'Regional Governance & District Grid Summary',
          badge: 'Southern Renewable District Board',
          metrics: [
            {
              label: 'District Compliance Rate',
              value: '96.2%',
              change: '14 municipalities online',
              trend: 'up',
              icon: Layers,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 96,
            },
            {
              label: 'Regional Solar Grid',
              value: '42.8 MW Peak',
              change: '+12% capacity addition',
              trend: 'up',
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/30',
              progress: 78,
            },
            {
              label: 'Industrial Carbon Cap',
              value: '78% of Threshold',
              change: 'Under regional limit',
              trend: 'up',
              icon: TrendingUp,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/30',
              progress: 78,
            },
            {
              label: 'Public Audit Index',
              value: 'Tier 1 Certified',
              change: 'Compliant with TN.GOV',
              trend: 'up',
              icon: CheckCircle2,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/30',
              progress: 95,
            },
          ],
        };

      case 'mlops':
        return {
          title: 'MLOps AI Model & Pipeline Performance',
          badge: 'VerdantIQ Neural Inference Engine',
          metrics: [
            {
              label: 'Model Inference Latency',
              value: '18 ms',
              change: '-4ms optimization',
              trend: 'up',
              icon: Cpu,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 95,
            },
            {
              label: 'Active AI Pipeline Models',
              value: '6 Models Deployed',
              change: 'Gemini 3.5 Flash Active',
              trend: 'up',
              icon: Sliders,
              color: 'text-purple-400',
              bg: 'bg-purple-500/10 border-purple-500/30',
              progress: 100,
            },
            {
              label: 'GPU Cluster Load',
              value: '48.5%',
              change: 'Balanced execution',
              trend: 'up',
              icon: Server,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/30',
              progress: 48,
            },
            {
              label: 'Drift & Prediction Accuracy',
              value: '99.1%',
              change: 'Zero prediction drift',
              trend: 'up',
              icon: Activity,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/30',
              progress: 99,
            },
          ],
        };

      case 'audit':
        return {
          title: 'ESG Compliance & Security Audit Summary',
          badge: 'Independent Oversight Board',
          metrics: [
            {
              label: 'Compliance Health Rate',
              value: '97.8%',
              change: 'Full audit pass',
              trend: 'up',
              icon: ShieldAlert,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 97,
            },
            {
              label: 'Pending Verifications',
              value: '2 Organizations',
              change: 'Under active review',
              trend: 'up',
              icon: BarChart3,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/30',
              progress: 40,
            },
            {
              label: 'ISO 14001 Readiness',
              value: 'Gold Standard',
              change: 'Audit ready',
              trend: 'up',
              icon: CheckCircle2,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/30',
              progress: 100,
            },
            {
              label: 'Data Governance Audit',
              value: 'Zero Breaches',
              change: 'MongoDB encrypted',
              trend: 'up',
              icon: Server,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/30',
              progress: 100,
            },
          ],
        };

      default:
        // Standard Individual Household User
        return {
          title: 'Household Energy & Carbon Summary',
          badge: 'Residential Smart Meter Hub',
          metrics: [
            {
              label: 'Household Energy Efficiency',
              value: '89 / 100',
              change: '+6% vs last month',
              trend: 'up',
              icon: Leaf,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
              progress: 89,
            },
            {
              label: 'Smart Meter Power',
              value: '2.4 kW / hr',
              change: 'Low consumption tier',
              trend: 'up',
              icon: Zap,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/30',
              progress: 42,
            },
            {
              label: 'Monthly Carbon Saved',
              value: '84 kg CO₂e',
              change: 'Solar offset active',
              trend: 'up',
              icon: CheckCircle2,
              color: 'text-teal-400',
              bg: 'bg-teal-500/10 border-teal-500/30',
              progress: 84,
            },
            {
              label: 'Community Leaderboard',
              value: '#12 in Neighborhood',
              change: 'Top 10% eco-saver',
              trend: 'up',
              icon: Award,
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border-blue-500/30',
              progress: 90,
            },
          ],
        };
    }
  };

  const summaryData = getRoleMetrics();

  return (
    <Card className={`p-5 sm:p-6 bg-stone-900/90 border border-emerald-800/40 text-stone-100 shadow-xl rounded-2xl ${className}`}>
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-editorial text-lg font-bold text-white tracking-tight">
                Quick Summary
              </h2>
              <Badge variant="emerald" dot className="text-[10px] uppercase tracking-wider font-mono">
                {roleConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{summaryData.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-[10px] font-mono text-stone-400 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
            Scope: {summaryData.badge}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-all cursor-pointer hover:text-white"
            title={`Refreshed ${lastRefreshed}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Dynamic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.metrics.map((metric, idx) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-stone-400 leading-tight">
                  {metric.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${metric.bg} border flex items-center justify-center shrink-0`}>
                  <IconComponent className={`w-4 h-4 ${metric.color}`} />
                </div>
              </div>

              <div>
                <div className="text-xl font-bold text-white tracking-tight font-mono">
                  {metric.value}
                </div>

                <div className="flex items-center space-x-1.5 mt-1 text-[11px] text-emerald-400 font-medium">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  <span className="truncate">{metric.change}</span>
                </div>
              </div>

              {/* Progress visual indicator */}
              <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info strip */}
      <div className="mt-4 pt-3 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time metric telemetry bound to email ID: <strong className="text-stone-200 font-mono">{user.email}</strong></span>
        </div>
        <span className="font-mono text-[10px] text-stone-500">Last Synced: {lastRefreshed}</span>
      </div>
    </Card>
  );
};
