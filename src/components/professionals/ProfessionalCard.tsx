
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProfessionalCard = ({ professional }: { professional: any }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <img
          src={professional.photo || "/placeholder.svg"}
          alt={professional.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{professional.name}</h3>
            <p className="text-sm text-gray-500">{professional.games?.name}</p>
          </div>
          <Badge>{professional.profession_type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Fee:</span> ₹{professional.fee} {professional.fee_type}
          </p>
          <p className="text-sm">
            <span className="font-medium">Location:</span> {professional.city}
          </p>
          <p className="text-sm">
            <span className="font-medium">Contact:</span> {professional.contact_number}
          </p>
          {professional.comments && (
            <p className="text-sm mt-2 text-gray-600">{professional.comments}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
