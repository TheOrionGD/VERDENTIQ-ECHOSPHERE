import * as React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Badge } from './Badge';

export interface StatGaugeProps {
  title: string;
  value: number;
  target: number;
  unit: string;
  trend?: 'up' | 'down' | 'neutral';
  changePercentage?: number;
  status?: 'optimal' | 'warning' | 'critical' | 'normal';
  subtitle?: string;
  className?: string;
}

export const StatGauge: React.FC<StatGaugeProps> = ({
  title,
  value,
  target,
  unit,
  trend = 'neutral',
  changePercentage = 0,
  status = 'optimal',
  subtitle,
  className,
}) => {
  // Calculate percentage toward target
  const percentage = Math.min(Math.max((value / target) * 100, 0), 100);
  const strokeDashoffset = 283 - (283 * Math.min(percentage, 100)) / 100;

  const getStatusBadge = () => {
    if (status === 'optimal' || status === 'normal') {
      return <Badge variant="emerald" dot>Optimal Range</Badge>;
    }
    if (status === 'warning') {
      return <Badge variant="amber" dot>Warning Threshold</Badge>;
    }
    return <Badge variant="coral" dot>Anomaly Detected</Badge>;
  };

  const getStrokeColor = () => {
    if (status === 'optimal') return '#047857'; // emerald-700
    if (status === 'warning') return '#d97706'; // amber-600
    return '#e11d48'; // rose-600
  };

  return (
    <div
      className={cn(
        'rounded-3xl border border-white/80 bg-white/40 backdrop-blur-md p-5 shadow-xs transition-all hover:border-emerald-500/30 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {title}
          </span>
          {subtitle && (
            <p className="text-[11px] text-stone-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {getStatusBadge()}
      </div>

      <div className="flex items-center justify-between gap-4 mt-2">
        {/* Value Display */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-3xl font-bold tracking-tight text-stone-900">
              {value.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-stone-500">{unit}</span>
          </div>

          {/* Target & Trend */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-stone-500 text-[11px]">
              Target: <strong className="text-stone-700">{target}</strong> {unit}
            </span>
            {changePercentage !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-md px-1.5 py-0.5',
                  trend === 'down'
                    ? 'text-emerald-800 bg-emerald-50'
                    : trend === 'up'
                    ? 'text-amber-800 bg-amber-50'
                    : 'text-stone-600 bg-stone-100'
                )}
              >
                {trend === 'up' && <ArrowUpRight className="h-3 w-3" />}
                {trend === 'down' && <ArrowDownRight className="h-3 w-3" />}
                {trend === 'neutral' && <Minus className="h-3 w-3" />}
                {Math.abs(changePercentage)}%
              </span>
            )}
          </div>
        </div>

        {/* Semi Circular Gauge */}
        <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#e7e5e4"
              strokeWidth="9"
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke={getStrokeColor()}
              strokeWidth="9"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-stone-800">
              {Math.round(percentage)}%
            </span>
            <span className="text-[9px] text-stone-400 leading-tight uppercase">
              Target
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
