import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend,
  variant = "default" 
}: StatsCardProps) {
  const cardVariants = {
    default: "bg-card",
    primary: "bg-gradient-primary text-white",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground"
  };

  return (
    <Card className={`${cardVariants[variant]} shadow-card hover:shadow-glow transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 opacity-70" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {(description || trend) && (
          <div className="flex items-center justify-between mt-2">
            {description && (
              <p className="text-xs opacity-70">
                {description}
              </p>
            )}
            {trend && (
              <Badge 
                variant={trend.isPositive ? "default" : "destructive"}
                className="text-xs"
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}