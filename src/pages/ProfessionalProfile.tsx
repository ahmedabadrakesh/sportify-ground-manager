import React, { useState } from "react";
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
  MapPin,
  Star,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  Camera,
  Users,
  Home,
  Plane,
  UserCheck,
  Target,
  LandPlot,
  CirclePlus,
  Quote,
  Youtube,
  BadgeIndianRupee,
  ChevronsRight,
  Edit,
  Eye,
  EyeOff,
  Award,
  Trophy,
} from "lucide-react";
import VideoGallery from "@/components/professionals/components/VideoGallery";
import ImageGallery from "@/components/professionals/components/ImageGallery";
import ContactDetails from "@/components/professionals/components/ContactDetails";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [isAboutRReadMoreOpened, setIsAboutRReadMoreOpened] =
    useState<boolean>(false);
  const [showContactDetails, setShowContactDetails] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const currentUser = getCurrentUserSync();
  const isSuperAdmin = hasRoleSync("super_admin");
  const isAuthenticated = !!currentUser;

  const { data: professional, isLoading } = useQuery({
    queryKey: ["professional", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sports_professionals")
        .select(
          `
          *,
          games (
            name
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch professional's email from users table
  const { data: professionalUser } = useQuery({
    queryKey: ["professional-user", professional?.user_id],
    queryFn: async () => {
      if (!professional?.user_id) return null;

      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("id", professional.user_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!professional?.user_id,
  });

  // Check if current user can edit this profile
  const canEdit =
    isAuthenticated &&
    (isSuperAdmin || professional?.user_id === currentUser?.id);

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    setShowContactDetails(!showContactDetails);
  };

  const handleUpdateProfile = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    setIsUpdateDialogOpen(true);
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.length > 2
        ? username.substring(0, 2) + "*".repeat(username.length - 2)
        : username;
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return "";
    if (phone.length <= 4) return phone;
    return (
      phone.substring(0, 2) +
      "*".repeat(phone.length - 4) +
      phone.substring(phone.length - 2)
    );
  };

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

  const renderArrayField = (
    items: string[] | null,
    icon: React.ReactNode,
    title: string
  ) => {
    if (!items || items.length === 0) return null;
    return (
      <Card className="flex-auto ">
        <CardContent>
          {items.map((achievement, index) => (
            <div className="flex" key={index}>
              {achievement}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderSocialLinks = () => {
    const links = [
      {
        url: professional.instagram_link || "",
        icon: <Instagram className="h-5 w-5" />,
        name: "Instagram",
        color: "red-600",
      },
      {
        url: professional.facebook_link || "",
        icon: <Facebook className="h-5 w-5" />,
        name: "Facebook",
        color: "red-600",
      },
      {
        url: professional.linkedin_link || "",
        icon: <Linkedin className="h-5 w-5" />,
        name: "LinkedIn",
        color: "red-600",
      },
      {
        url: professional.website || "",
        icon: <Globe className="h-5 w-5" />,
        name: "Website",
        color: "red-600",
      },
    ];

    const activeLinks = links;

    if (activeLinks.length === 0) return null;

    return (
      <div className="flex md:flex-row flex-wrap items-baseline gap-1">
        {activeLinks.map(
          (link, index) =>
            link.url && (
              <div className="flex items-end" key={index}>
                <a href={link.url} target="_blank" rel="noopener">
                  <div
                    className={`p-2 bg-${link.color} border-2 border-solid rounded-lg text-white group-hover:scale-110`}
                  >
                    {link.icon}
                  </div>
                </a>
              </div>
            )
        )}
      </div>
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
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden border"
              >
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
      case "Personal":
        return <UserCheck className="h-4 w-4" />;
      case "Group":
        return <Users className="h-4 w-4" />;
      case "Home":
        return <Home className="h-4 w-4" />;
      case "Out of City":
        return <Plane className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getFiftyWords = (str, count) => {
    if (str.length > count) {
      return str.split(" ").slice(0, count).join(" ") + " ... ";
    } else {
      return str + " ";
    }
  };

  const showOrangeDividerLine = () => {
    return (
      <div className="pb-6 pt-6">
        <hr className="w-49 h-0.5 mx-auto my-2 bg-orange-300 border-0 rounded-sm md:my-4" />
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            {/* Back button and Update Profile button */}
            <div className="mb-8 flex justify-between items-center">
              <Link to="/sports-professionals">
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Professionals
                </Button>
              </Link>
              {canEdit && (
                <Button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4" />
                  Update Profile
                </Button>
              )}
            </div>

            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar and Initials */}
              <div className="relative">
                <div className="w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl lg:text-6xl font-bold">
                  {professional.photo ? (
                    <img
                      src={professional.photo}
                      alt={professional.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    professional.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {professional.name}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 mb-6">
                  {professional.profession_type}, {professional.games?.name}
                </p>
                {professional.punch_line && (
                  <p className="text-lg text-gray-400 mb-6 italic">
                    "{professional.punch_line}"
                  </p>
                )}

                {/* Achievement Badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  {professional.years_of_experience && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                      <div className="text-2xl font-bold">{professional.years_of_experience}+</div>
                      <div className="text-sm text-gray-300">Years Experience</div>
                    </div>
                  )}
                  {professional.total_match_played && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                      <div className="text-2xl font-bold">{professional.total_match_played}+</div>
                      <div className="text-sm text-gray-300">Matches Played</div>
                    </div>
                  )}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                    <div className="text-2xl font-bold">✓</div>
                    <div className="text-sm text-gray-300">Certified Professional</div>
                  </div>
                </div>

                {/* Location and Social Links */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    <MapPin className="w-4 h-4 mr-2" />
                    {professional.city}
                  </Badge>
                  {renderSocialLinks()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* About Me Section */}
              {professional.comments && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Quote className="h-5 w-5 text-primary" />
                      About Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {isAboutRReadMoreOpened
                        ? professional.comments
                        : getFiftyWords(professional.comments, 50)}
                      {professional.comments.length >= 50 && (
                        <button
                          onClick={() =>
                            setIsAboutRReadMoreOpened(!isAboutRReadMoreOpened)
                          }
                          className="ml-2 text-primary hover:underline font-medium"
                        >
                          {isAboutRReadMoreOpened ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Specialties */}
              {professional.accomplishments && professional.accomplishments.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Specialties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {professional.accomplishments.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Success Stories */}
              {professional.awards && professional.awards.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Success Stories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {professional.awards.map((story, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <p className="text-gray-700 leading-relaxed">{story}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Training Gallery */}
              {professional.images && professional.images.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Training Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageGallery images={professional.images} />
                  </CardContent>
                </Card>
              )}

              {/* Certifications & Education */}
              {professional.certifications && professional.certifications.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Certifications & Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {professional.certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Featured Videos */}
              {professional.videos && professional.videos.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-primary" />
                      Training Videos & Reels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoGallery videos={professional.videos} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Contact & Details */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="bg-white shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-500">Phone</p>
                        <p className="cursor-pointer" onClick={handleContactClick}>
                          {showContactDetails
                            ? professional.contact_number
                            : maskPhone(professional.contact_number)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-500">Email</p>
                        <p className="cursor-pointer" onClick={handleContactClick}>
                          {showContactDetails
                            ? professionalUser?.email
                            : maskEmail(professionalUser?.email || "")}
                        </p>
                      </div>
                    </div>

                    {!isAuthenticated && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-xs mb-2">
                          Full contact details available after registration
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setIsAuthDialogOpen(true)}
                        >
                          Register / Login
                        </Button>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-slate-800 hover:bg-slate-700"
                      onClick={handleContactClick}
                    >
                      Contact Me
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Training Locations */}
              {professional.training_locations && professional.training_locations.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Training Locations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {professional.training_locations.map((location, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Pricing */}
              {professional.fee && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        ₹{professional.fee}
                      </div>
                      <div className="text-sm text-gray-600">
                        {professional.fee_type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability */}
              {professional.coaching_availability && professional.coaching_availability.length > 0 && (
                <Card className="bg-white shadow-lg">
                  <CardHeader>
                    <CardTitle>Available For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {professional.coaching_availability.map((availability, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {availability}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <RegisterProfessionalDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        hasExistingProfile={true}
        isUpdate={true}
      />

      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        title="Login Required"
        description="Please login or register to view contact details and access all features."
      />
    </MainLayout>
  );
};

export default ProfessionalProfile;
