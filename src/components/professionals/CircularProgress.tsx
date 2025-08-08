import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CircularProgressProps {
  professional: any;
  handleUpdateProfile: any;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  professional,
  handleUpdateProfile,
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
      "state",
      "country",
      "pincode",
      "current_location",
      "training_locations",
      "website",
      "instagram_link",
      "facebook_link",
      "linkedin_link",
      "certifications",
      "accomplishments",
      "success_stories",
      "videos",
      "images",
      "game_ids",
      "games_played",
      "coaching_availability",
      "fee_per_hour",
      "fee_per_session",
      "district_level_tournaments",
      "state_level_tournaments",
      "national_level_tournaments",
      "international_level_tournaments",
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

  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg
          className="transform w-48 h-48"
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
          <span className="text-success text-xl font-bold">{percentage}%</span>
        </div>
      </div>
      <Button
        className="w-full bg-slate-800 hover:bg-slate-700"
        onClick={handleUpdateProfile}
      >
        Complete Your Profile Now
      </Button>
    </div>
  );
};

export default CircularProgress;
