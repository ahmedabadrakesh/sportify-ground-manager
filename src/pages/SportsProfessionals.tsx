
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfessionalsList from "@/components/professionals/ProfessionalsList";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";

const SportsProfessionals = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sports Professionals</h1>
            <p className="text-gray-600">
              Find experienced sports professionals or register yourself
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            Register as Professional
          </Button>
        </div>

        <ProfessionalsList />

        <RegisterProfessionalDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </MainLayout>
  );
};

export default SportsProfessionals;
