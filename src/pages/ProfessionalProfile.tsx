
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Phone, MapPin, Calendar, Clock, User, Award, Star } from "lucide-react";

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data: professional, isLoading } = useQuery({
    queryKey: ["professional", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_professionals")
        .select(`
          *,
          games (
            name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!professional) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Professional not found</h1>
            <Link to="/sports-professionals">
              <Button>Back to Professionals</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/sports-professionals">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Professionals
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={professional.photo || "/placeholder.svg"}
                      alt={professional.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {professional.profession_type}
                          </Badge>
                          <Badge variant="outline">{professional.games?.name}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{professional.city}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ₹{professional.fee}
                        </div>
                        <div className="text-sm text-gray-500">
                          {professional.fee_type}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            {professional.comments && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">About</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{professional.comments}</p>
                </CardContent>
              </Card>
            )}

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Professional Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Profession Type</div>
                      <div className="font-medium">{professional.profession_type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Sport</div>
                      <div className="font-medium">{professional.games?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">{professional.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium">
                        {new Date(professional.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {professional.address && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="font-medium">{professional.address}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium">{professional.contact_number}</div>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Professional
                </Button>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Pricing</h3>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary">₹{professional.fee}</div>
                  <div className="text-gray-600">{professional.fee_type}</div>
                </div>
                <Button className="w-full mt-4" size="lg">
                  Book Session
                </Button>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Quick Facts</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sport</span>
                  <span className="font-medium">{professional.games?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{professional.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{professional.profession_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate</span>
                  <span className="font-medium">₹{professional.fee}/{professional.fee_type}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfile;
