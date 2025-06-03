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
  Target,
  Gamepad,
  LandPlot,
  TrophyIcon,
} from "lucide-react";
import About from "@/components/professionals/components/About";
import VideoGallery from "@/components/professionals/components/videoGallery";
import ImageGallery from "@/components/professionals/components/ImageGallery";
import ContactDetails from "@/components/professionals/components/ContactDetails";

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();

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
        <CardHeader className="pb-3">
          <CardTitle className="block items-center gap-2 text-lg">
            <div
              className={`inline-flex p-4 gap-6 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              {icon}
              <h3 className="text-lg font-bold text-center">{title}</h3>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((achievement, index) => (
            <div className="flex">
              <h3 className="text-lg font-bold text-center">{`${
                index + 1
              }.   ${achievement}`}</h3>
              {/* <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {achievement.year}
                      </span>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {achievement.description}
                      </p> */}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderSocialLinks = () => {
    const links = [
      {
        url: professional.instagram_link,
        icon: <Instagram className="h-5 w-5" />,
        name: "Instagram",
        color: "text-pink-600",
      },
      {
        url: professional.facebook_link,
        icon: <Facebook className="h-5 w-5" />,
        name: "Facebook",
        color: "text-blue-600",
      },
      {
        url: professional.linkedin_link,
        icon: <Linkedin className="h-5 w-5" />,
        name: "LinkedIn",
        color: "text-blue-700",
      },
      {
        url: professional.website,
        icon: <Globe className="h-5 w-5" />,
        name: "Website",
        color: "text-gray-600",
      },
    ];

    const activeLinks = links.filter((link) => link.url);

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
        <div className="">
          <div>
            <div className="w-full h-[250px]">
              <img
                src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
                className="w-full h-full rounded-tl-lg rounded-tr-lg"
              />
            </div>
            <div className="flex flex-col items-center -mt-20">
              {/* <img
              src="https://vojislavd.com/ta-template-demo/assets/img/profile.jpg"
              className="w-40 border-4 border-white rounded-full"
            /> */}
              <Avatar className="w-32 h-32">
                {professional.photo && (
                  <AvatarImage
                    src={professional.photo || "/placeholder.svg"}
                    alt={professional.name}
                  />
                )}
                <AvatarFallback className="text-6xl">
                  {professional.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2 mt-2">
                <p className="text-2xl">{professional.name}</p>
                <span className="bg-blue-500 rounded-full p-1" title="Verified">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-100 h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="4"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
              </div>
              <p className="text-xl sm:text-xl italic lg:text-2xl font-light mb-6">
                {professional.punch_line}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="default"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{professional.city}</span>
                </Badge>
                {professional.profession_type && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 ring-1 ring-green-700 ring-inset"
                  >
                    <Star className="h-3 w-3" />
                    {professional.profession_type}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 px-4 py-2 ring-1 ring-green-700 ring-inset"
                >
                  <LandPlot className="w-4 h-4 text-green-400" />
                  {professional.games?.name}
                </Badge>
                {professional.level && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-4 py-2 ring-1 ring-green-700 ring-inset"
                  >
                    <Star className="h-3 w-3" />
                    {professional.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32">
                      <AvatarImage
                        src={professional.photo || "/placeholder.svg"}
                        alt={professional.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {professional.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                          {professional.name}
                        </h1>
                        {professional.punch_line && (
                          <p className="text-lg text-gray-600 italic mt-1">
                            {professional.punch_line}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="default"
                          className="flex items-center gap-1"
                        >
                          <Award className="h-3 w-3" />
                          {professional.profession_type}
                        </Badge>
                        <Badge variant="outline">
                          {professional.games?.name}
                        </Badge>
                        {professional.level && (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
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
                          <span>
                            Member since{" "}
                            {new Date(professional.created_at).getFullYear()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-2xl font-bold text-primary">
                            ₹{professional.fee}
                          </span>
                          <span className="text-gray-500">
                            / {professional.fee_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
            <About professional={professional} />
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                    Achievements
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-4"></div>
                  <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                    A track record of excellence in competition and coaching
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {renderArrayField(
                    professional.awards,
                    <Trophy className="h-5 w-5" />,
                    "Awards"
                  )}
                  {/* Accomplishments */}
                  {renderArrayField(
                    professional.accomplishments,
                    <Star className="h-5 w-5" />,
                    "Accomplishments"
                  )}
                  {/* Certifications */}
                  {renderArrayField(
                    professional.certifications,
                    <GraduationCap className="h-5 w-5" />,
                    "Certifications"
                  )}
                </div>
              </div>
            </section>
            <ImageGallery images={professional.images} />
            <VideoGallery videos={professional.videos} />
            <ContactDetails professional={professional} />
            {/* Training Locations */}
            {/* {renderArrayField(
              professional.training_locations,
              <MapPin className="h-5 w-5" />,
              "Training Locations"
            )} */}
            {/* Address
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
            )} */}
            {/* Coaching Availability */}
            {/* {professional.coaching_availability &&
              professional.coaching_availability.length > 0 && (
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
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          {getCoachingAvailabilityIcon(type)}
                          <span className="text-sm font-medium">{type}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )} */}
            {/* Images Gallery */}
            {/* {renderImages()} */}
            {/* Videos */}
            {/* {renderVideoLinks()} */}
            {/* Social Links */}
            {/* {renderSocialLinks()} */}
            {/* Contact Actions */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfile;
