
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  subtext?: string;
  colorClass?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  subtext,
  colorClass = "border-blue-200",
  className,
  trend,
  trendValue,
}) => (
  <div className={cn(
    "flex items-center gap-4 bg-white border rounded-lg px-6 py-5 shadow hover:shadow-md transition-all duration-200 min-w-[200px] hover:scale-105 cursor-pointer",
    colorClass,
    className
  )}>
    <div className="p-2 rounded-full bg-blue-50 text-blue-600">{icon}</div>
    <div className="flex-1">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {subtext && <div className="text-xs text-gray-400">{subtext}</div>}
      {trend && trendValue && (
        <div className={cn(
          "text-xs font-medium mt-1",
          trend === "up" && "text-green-600",
          trend === "down" && "text-red-600",
          trend === "neutral" && "text-gray-600"
        )}>
          {trend === "up" && "↗ "}
          {trend === "down" && "↘ "}
          {trendValue}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
