import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: number;
}

export function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-xl shadow-md p-6 border bg-white border-amazon-orange/20 hover:border-amazon-orange/40 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-walmart-blue/10">
          <div className="text-walmart-blue">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-amazon-brown">
            {label}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-amazon-brown">
              {value}
            </p>
            {trend !== undefined && (
              <div className={`flex items-center text-sm ${
                trend >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend >= 0 ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}