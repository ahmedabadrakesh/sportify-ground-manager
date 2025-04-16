
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import AdminLayout from "@/components/layouts/AdminLayout";
import GroundBasicDetails from "@/components/admin/grounds/GroundBasicDetails";
import GroundFeatures from "@/components/admin/grounds/GroundFeatures";
import GroundOwnerSelect from "@/components/admin/grounds/GroundOwnerSelect";
import GroundFormActions from "@/components/admin/grounds/GroundFormActions";
import GroundImageUpload from "@/components/admin/grounds/GroundImageUpload";
import { useGroundForm } from "@/components/admin/grounds/useGroundForm";

const AddGround: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { 
    form, 
    isLoading, 
    owners, 
    isSuperAdmin, 
    fetchOwners, 
    onSubmit 
  } = useGroundForm(selectedImages);

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate("/admin/grounds")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Ground</h1>
            <p className="text-gray-600">Create a new sports ground</p>
          </div>
        </div>

        <div className="bg-white rounded-md shadow p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grid layout for name and owner selection */}
                <div>
                  <GroundBasicDetails form={form} />
                </div>
                
                {isSuperAdmin && (
                  <div className="mt-6 md:mt-0">
                    <GroundOwnerSelect form={form} owners={owners} />
                  </div>
                )}
              </div>

              <GroundFeatures form={form} />

              {/* Add the new image upload component */}
              <GroundImageUpload onImagesChange={handleImagesChange} />
              
              <GroundFormActions 
                isLoading={isLoading} 
                onCancel={() => navigate("/admin/grounds")} 
              />
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddGround;
