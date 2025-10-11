import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CircularProgressProps {
  professional: any;
  showPercentageOnly?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  professional,
  showPercentageOnly = false,
}) => {
  const calculateCompletionPercentage = () => {
    if (!professional) return 0;

    const fields = [
      "name",
      "profession_type",
      "about_me",
      "punch_line",
      "years_of_experience",
      "photo",
      "phone",
      "city",
      "website",
      "instagram_link",
      "linkedin_link",
      "certifications",
      "accomplishments",
      "success_stories",
      "videos",
      "images",
      "game_ids",
      "coaching_availability",
      "one_on_one_price",
      "group_session_price",
      "online_price",
      "district_level_tournaments",
      "state_level_tournaments",
      "national_level_tournaments",
      "international_level_tournaments",
      "number_of_clients_served",
      "is_certified",
    ];

    let filledFields = 0;

    fields.forEach((field) => {
      const value = professional[field];
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        filledFields++;
      }
    });

    return Math.round((filledFields / fields.length) * 100);
  };

  const percentage = calculateCompletionPercentage();

  const getProgressColor = () => {
    if (percentage < 20) return "hsl(0, 84%, 60%)"; // red
    if (percentage >= 21 && percentage <= 50) return "hsl(39, 100%, 50%)"; // orange
    if (percentage >= 51 && percentage <= 80) return "hsl(221, 83%, 53%)"; // blue
    if (percentage >= 81 && percentage <= 90) return "hsl(142, 71%, 45%)"; // green
    return "hsl(280, 100%, 70%)"; // purple for >90%
  };

  const radius = 80;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      {showPercentageOnly === false && (
        <div className="relative w-40 h-40">
          <svg
            className="transform w-40 h-40 "
            width={radius * 2}
            height={radius * 2}
          >
            {/* Background circle */}
            <circle
              stroke="gray"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              opacity={0.3}
            />
            {/* Progress circle */}
            <circle
              stroke={getProgressColor()}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>
          {/* Percentage text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-success text-xl font-bold">
              {percentage}%
            </span>
          </div>
        </div>
      )}
      {showPercentageOnly === true && percentage <= 70 && (
        <div className="w-full bg-gray-200 rounded-full h-0.5 mb-2 dark:bg-gray-700">
          <div
            className="bg-blue-600 font-medium h-0.5 text-blue-100 text-center leading-none rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
      {showPercentageOnly === true && percentage > 70 && (
        <div className="w-full bg-gray-200 rounded-full h-0.5 mb-2 dark:bg-gray-700">
          <div
            className="bg-green-600 font-medium h-0.5 text-blue-100 text-center leading-none rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
