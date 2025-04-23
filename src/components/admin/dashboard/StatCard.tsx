
import React from "react";
import CountUp from "react-countup"; // Change from { CountUp } to default import
import { Card, CardContent } from "@/components/ui/card";
import { getAnimationDuration } from "@/utils/stats";

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  subLabel?: string;
  statsVisible: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  value, 
  label, 
  subLabel, 
  statsVisible 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
            {icon}
          </div>
          <div className="text-2xl font-bold mb-1">
            {statsVisible ? (
              <CountUp 
                start={0} 
                end={value} 
                decimals={0}
                delay={0}
              />
            ) : (
              0
            )}
          </div>
          <div className="text-sm px-3 py-0.5 bg-gray-100 rounded-full mb-1">{label}</div>
          {subLabel && (
            <p className="text-xs text-gray-500">
              {subLabel}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
