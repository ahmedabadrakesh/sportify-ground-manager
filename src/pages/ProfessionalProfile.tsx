
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Award, 
  Star,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  Video,
  Camera,
  MapPinIcon,
  Users,
  Home,
  Plane,
  UserCheck,
  Trophy,
  GraduationCap,
  Target
} from "lucide-react";

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

  const renderArrayField = (items: string[] | null, icon: React.ReactNode, title: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSocialLinks = () => {
    const links = [
      { url: professional.instagram_link, icon: <Instagram className="h-5 w-5" />, name: "Instagram", color: "text-pink-600" },
      { url: professional.facebook_link, icon: <Facebook className="h-5 w-5" />, name: "Facebook", color: "text-blue-600" },
      { url: professional.linkedin_link, icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", color: "text-blue-700" },
      { url: professional.website, icon: <Globe className="h-5 w-5" />, name: "Website", color: "text-gray-600" },
    ];

    const activeLinks = links.filter(link => link.url);
    
    if (activeLinks.length === 0) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className={link.color}>{link.icon}</span>
                <span className="font-medium text-gray-700">{link.name}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderVideoLinks = () => {
    if (!professional.videos || professional.videos.length === 0) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5" />
            Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {professional.videos.map((video, index) => (
              <a
                key={index}
                href={video}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Video className="h-5 w-5 text-red-600" />
                <span className="text-blue-600 hover:underline truncate">
                  Video {index + 1}
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderImages = () => {
    if (!professional.images || professional.images.length === 0) return null;

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5" />
            Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {professional.images.map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const getCoachingAvailabilityIcon = (type: string) => {
    switch (type) {
      case "Personal": return <UserCheck className="h-4 w-4" />;
      case "Group": return <Users className="h-4 w-4" />;
      case "Home": return <Home className="h-4 w-4" />;
      case "Out of City": return <Plane className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

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

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={professional.photo || "/placeholder.svg"} alt={professional.name} />
                    <AvatarFallback className="text-2xl">{professional.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{professional.name}</h1>
                      {professional.punch_line && (
                        <p className="text-lg text-gray-600 italic mt-1">{professional.punch_line}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {professional.profession_type}
                      </Badge>
                      <Badge variant="outline">{professional.games?.name}</Badge>
                      {professional.level && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {professional.level}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{professional.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{professional.contact_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Member since {new Date(professional.created_at).getFullYear()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-2xl font-bold text-primary">₹{professional.fee}</span>
                        <span className="text-gray-500">/ {professional.fee_type}</span>
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
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{professional.comments}</p>
              </CardContent>
            </Card>
          )}

          {/* Address */}
          {professional.address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{professional.address}</p>
              </CardContent>
            </Card>
          )}

          {/* Coaching Availability */}
          {professional.coaching_availability && professional.coaching_availability.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Coaching Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {professional.coaching_availability.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      {getCoachingAvailabilityIcon(type)}
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Awards */}
          {renderArrayField(professional.awards, <Trophy className="h-5 w-5" />, "Awards")}

          {/* Accomplishments */}
          {renderArrayField(professional.accomplishments, <Star className="h-5 w-5" />, "Accomplishments")}

          {/* Certifications */}
          {renderArrayField(professional.certifications, <GraduationCap className="h-5 w-5" />, "Certifications")}

          {/* Training Locations */}
          {renderArrayField(professional.training_locations, <MapPin className="h-5 w-5" />, "Training Locations")}

          {/* Images Gallery */}
          {renderImages()}

          {/* Videos */}
          {renderVideoLinks()}

          {/* Social Links */}
          {renderSocialLinks()}

          {/* Contact Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Contact Professional
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Calendar className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfile;
