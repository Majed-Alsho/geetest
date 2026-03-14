'use client';

import { motion } from 'framer-motion';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'revenue' | 'ebitda' | 'growth';
}

export function ChartCard({ title, subtitle, type }: ChartCardProps) {
  const getChartPath = () => {
    switch (type) {
      case 'revenue':
        return {
          path: 'M 20 120 L 60 100 L 100 110 L 140 85 L 180 70 L 220 60 L 260 45 L 300 30',
          area: 'M 20 120 L 60 100 L 100 110 L 140 85 L 180 70 L 220 60 L 260 45 L 300 30 L 300 140 L 20 140 Z',
          color: 'hsl(142 76% 36%)'
        };
      case 'ebitda':
        return {
          path: 'M 20 110 L 60 105 L 100 95 L 140 80 L 180 75 L 220 55 L 260 50 L 300 35',
          area: 'M 20 110 L 60 105 L 100 95 L 140 80 L 180 75 L 220 55 L 260 50 L 300 35 L 300 140 L 20 140 Z',
          color: 'hsl(160 60% 45%)'
        };
      case 'growth':
        return {
          path: 'M 20 100 L 60 95 L 100 75 L 140 70 L 180 50 L 220 45 L 260 35 L 300 25',
          area: 'M 20 100 L 60 95 L 100 75 L 140 70 L 180 50 L 220 45 L 260 35 L 300 25 L 300 140 L 20 140 Z',
          color: 'hsl(220 76% 50%)'
        };
    }
  };

  const chart = getChartPath();

  return (
    <div className="glass-panel p-6 h-full">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="relative">
        <svg 
          viewBox="0 0 320 140" 
          className="w-full h-40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chart.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
            <line x1="20" y1="40" x2="300" y2="40" />
            <line x1="20" y1="70" x2="300" y2="70" />
            <line x1="20" y1="100" x2="300" y2="100" />
          </g>

          {/* Area fill */}
          <motion.path
            d={chart.area}
            fill={`url(#gradient-${type})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Line */}
          <motion.path
            d={chart.path}
            fill="none"
            stroke={chart.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* End point */}
          <motion.circle
            cx="300"
            cy={type === 'revenue' ? 30 : type === 'ebitda' ? 35 : 25}
            r="6"
            fill={chart.color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          />
        </svg>

        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>2020</span>
          <span>2022</span>
          <span>2024</span>
          <span>2026 (Proj.)</span>
        </div>
      </div>
    </div>
  );
}
