import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layouts/MainLayout";
import SEOHead from "@/components/SEOHead";
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
  CheckCircle,
  Phone,
  Mail,
  Clock,
  DollarSign,
  IndianRupee,
  CircleCheck,
  BadgeCheck,
  AwardIcon,
} from "lucide-react";
import VideoGallery from "@/components/professionals/components/VideoGallery";
import ImageGallery from "@/components/professionals/components/ImageGallery";
import ContactDetails from "@/components/professionals/components/ContactDetails";
import ContactDetailsPopup from "@/components/professionals/ContactDetailsPopup";
import { getCurrentUserSync, hasRoleSync } from "@/utils/auth";
import RegisterProfessionalDialog from "@/components/professionals/RegisterProfessionalDialog";
import AuthRequiredDialog from "@/components/auth/AuthRequiredDialog";
import CircularProgress from "@/components/professionals/CircularProgress";
import coachProfileImage from "@/assets/coach-profile.jpg";
import { findNameById, getInitials, toTitleCase } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import trainingPhoto1 from "@/assets/coach-profile.jpg";
import { Separator } from "@radix-ui/react-select";

const ProfessionalProfile = () => {
  const { id, name } = useParams<{ id: string; name: string }>();
  const [isAboutReadMoreOpened, setisAboutReadMoreOpened] =
    useState<boolean>(false);
  const [showContactDetails, setShowContactDetails] = useState<boolean>(false);
  const [contactPopupOpen, setContactPopupOpen] = useState<boolean>(false);
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
          id, profession_type, name, fee, fee_type, address, city, comments,
          photo, user_id, created_at, updated_at, awards, accomplishments,
          certifications, training_locations, videos, images, punch_line,
          instagram_link, facebook_link, linkedin_link, website, level,
          coaching_availability, youtube_link, years_of_experience,
          total_match_played, academy_name, whatsapp, whatsapp_same_as_phone,
          district_level_tournaments, state_level_tournaments,
          national_level_tournaments, international_level_tournaments,
          specialties, education, one_on_one_price, group_session_price,
          online_price, free_demo_call, about_me, success_stories,
          training_locations_detailed, is_certified, game_ids, deleted_at
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const howManyMatchPlayed = () => {
    return (
      professional.district_level_tournaments +
      professional.state_level_tournaments +
      professional.national_level_tournaments +
      professional.international_level_tournaments
    );
  };

  const { data: gameData } = useQuery({
    queryKey: ["id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Check if current user can edit this profile
  const canEdit =
    isAuthenticated &&
    (isSuperAdmin ||
      (currentUser && professional?.user_id === currentUser?.id));

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }
    setContactPopupOpen(true);
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
              <div className="flex items-end mr-6" key={index}>
                <a href={link.url} target="_blank" rel="noopener">
                  {link.icon}
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

  const structuredData = professional
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: professional?.name || "Professional",
        jobTitle: professional.profession_type,
        description: professional.about_me || professional.comments,
        url: typeof window !== "undefined" ? window.location.href : "",
        address: {
          "@type": "PostalAddress",
          addressLocality: professional.city,
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
        },
        sameAs: [
          professional.instagram_link,
          professional.facebook_link,
          professional.linkedin_link,
          professional.website,
        ].filter(Boolean),
      }
    : undefined;

  return (
    <MainLayout>
      <SEOHead
        title={
          professional?.name
            ? `${professional.name} - ${professional.profession_type} | Jokova`
            : "Professional Profile | Jokova"
        }
        description={
          professional?.name
            ? `${professional.name} is a ${professional.profession_type} in ${
                professional.city
              }. ${
                professional.about_me ||
                professional.comments ||
                "Book sports training sessions with certified professionals."
              }`.substring(0, 160)
            : "Find and book sessions with certified sports professionals on Jokova."
        }
        keywords={
          professional?.name
            ? `${professional.name}, ${professional.profession_type}, sports professional, ${professional.city}, sports training, coaching`
            : "sports professional, coaching, training"
        }
        canonicalUrl={typeof window !== "undefined" ? window.location.href : ""}
        structuredData={structuredData}
      />
      <div>
        {/* Header Section */}
        <div className="from-slate-800 to-slate-900 text-white py-4 ">
          <div className="container mx-auto px-4">
            {/* Back button and Update Profile button */}
            <div className="mb-8 flex justify-between items-center">
              <Link to="/sports-professionals">
                <Button
                  variant="ghost"
                  className="flex bg-gradient-to-r items-center gap-2 hover:bg-white"
                >
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
            <div className="bg-gradient-to-r p-12 flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar and Initials */}
              <div className="relative flex flex-col items-center gap-4 w-full lg:w-auto">
                <div className="w-32 h-32 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-4xl lg:text-6xl font-bold mx-auto lg:mx-0">
                  {professional.photo ? (
                    <Avatar className="w-32 h-32 border-4 border-primary-foreground shadow-elegant">
                      <AvatarImage
                        src={professional.photo || coachProfileImage}
                        alt={`Coach ${professional.name}`}
                      />
                      <AvatarFallback>
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    professional?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="flex text-4xl lg:text-5xl font-bold mb-1 capitalize">
                  {toTitleCase(professional?.name || "Professional")}
                  {professional.is_certified && (
                    <div className="relative group">
                      <BadgeCheck
                        size={32}
                        color="white"
                        className="ml-2"
                        fill="#1f2ce0"
                        type="button"
                      />
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white text-black text-xs rounded py-1 px-2 z-10">
                        {"Certified"}
                      </div>
                    </div>
                  )}
                </h1>

                <p className="text-sm lg:text-lg text-gray-300">
                  {professional.profession_type},{" Sports Professional"}
                </p>
                <>
                  {professional.game_ids &&
                    professional.game_ids.map((gameId) => {
                      return (
                        <Badge
                          variant="secondary"
                          className="text-sm bg-gray-100 text-gray-700 border-0 mt-2 mb-4 mr-2"
                        >
                          {findNameById(gameData, gameId)}
                        </Badge>
                      );
                    })}
                </>

                <div className="block md:hidden grid grid-cols-2 md:grid-cols-5 gap-4 text-centers mb-6">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">
                      {professional.years_of_experience}+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Years Experience
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">
                      {100}+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Clients Trained
                    </div>
                  </div>
                  {howManyMatchPlayed() !== 0 && (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">
                        {professional.district_level_tournaments +
                          professional.state_level_tournaments +
                          professional.national_level_tournaments +
                          professional.international_level_tournaments}
                        +
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Match Played
                      </div>
                    </div>
                  )}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center flex-col mb-2">
                      <MapPin className="w-6 h-6" color="#000000" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {professional.city || "India"}
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="hidden md:flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                  {professional.years_of_experience && (
                    <Badge
                      variant="secondary"
                      className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                    >
                      {professional.years_of_experience}+ Years Experience
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                  >
                    {100}+ Clients Trained
                  </Badge>

                  {howManyMatchPlayed() !== 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                    >
                      {howManyMatchPlayed()}+ Match Played
                    </Badge>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {professional.city || "India"}
                  </Badge>
                  {/* {professional.total_match_played && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                      <div className="text-2xl font-bold">
                        {professional.total_match_played}+
                      </div>
                      <div className="text-sm text-gray-300">
                        Matches Played
                      </div>
                    </div>
                  )}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                    <div className="text-2xl font-bold">✓</div>
                    <div className="text-sm text-gray-300">
                      Certified Professional
                    </div>
                  </div> */}
                </div>

                {/* Location and Social Links */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
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
              {professional.about_me && (
                <Card className="shadow-elegant border-2 border-primary bg-muted/20">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="flex items-center gap-2">
                      <Quote className="h-5 w-5" />
                      About Me
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-500 rotate-180" />
                      {professional.punch_line && (
                        <p className="text-lg text-gray-700 ml-8 mb-6 italic text-left leading-relaxed ">
                          {professional.punch_line}
                        </p>
                      )}
                      <Quote className="absolute -bottom-2 -right-2 w-8 h-8 text-gray-500 " />

                      <p className="text-foreground text-gray-700 text-left leading-relaxed">
                        {isAboutReadMoreOpened
                          ? professional.about_me
                          : getFiftyWords(professional.about_me, 50)}
                        {professional.about_me.length >= 50 && (
                          <button
                            onClick={() =>
                              setisAboutReadMoreOpened(!isAboutReadMoreOpened)
                            }
                            className="ml-2 text-primary hover:underline font-medium"
                          >
                            {isAboutReadMoreOpened ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Specialties */}
              {professional.accomplishments &&
                professional.accomplishments.length > 0 && (
                  <Card className="bg-white ">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Award className="w-5 h-5" />
                        Specialties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {professional.accomplishments.map(
                          (specialty, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-sm">{specialty}</span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Success Stories */}
              {Array.isArray(professional.success_stories) &&
                professional.success_stories.length > 0 && (
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Success Stories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(professional.success_stories as any[]).map(
                        (story, index) => (
                          <div
                            key={index}
                            className="border-l-4 border-success pl-4"
                          >
                            <h4 className="font-semibold text-left text-foreground">
                              {story.client_name} (Age {story.age})
                            </h4>
                            <p className="text-sm text-left text-muted-foreground mt-1">
                              {story.story_details}
                            </p>
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                )}

              {/* Training Gallery */}
              {professional.images && professional.images.length > 0 && (
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Training Gallery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* <ImageGallery images={professional.images} /> */}
                    <Carousel className="w-full">
                      <CarouselContent>
                        {professional.images.map((photo, index) => (
                          <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                          >
                            <div className="rounded-lg overflow-hidden shadow-md">
                              <img
                                src={photo || trainingPhoto1}
                                alt={photo}
                                className="w-full h-48 object-cover"
                              />
                              {/* <div className="p-3 bg-card">
                                <p className="text-sm font-medium">{photo}</p>
                              </div> */}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </CardContent>
                </Card>
              )}

              {/* Certifications & Education */}
              {professional.certifications &&
                professional.certifications.length > 0 && (
                  <Card className="bg-white">
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

              {/* Tournament Participation */}
              {(professional.district_level_tournaments ||
                professional.state_level_tournaments ||
                professional.national_level_tournaments ||
                professional.international_level_tournaments) && (
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Trophy className="w-5 h-5" />
                      Tournament Participation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {professional.district_level_tournaments !== 0 && (
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">
                            {professional.district_level_tournaments}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            District Level
                          </div>
                        </div>
                      )}
                      {professional.state_level_tournaments !== 0 && (
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">
                            {professional.state_level_tournaments}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            State Level
                          </div>
                        </div>
                      )}
                      {professional.national_level_tournament !== 0 && (
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">
                            {professional.national_level_tournaments}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            National Level
                          </div>
                        </div>
                      )}
                      {professional.international_level_tournaments !== 0 && (
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">
                            {professional.international_level_tournaments}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            International
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm text-center text-muted-foreground">
                        <strong className="text-primary">
                          {professional.district_level_tournaments +
                            professional.state_level_tournaments +
                            professional.national_level_tournaments +
                            professional.international_level_tournaments}{" "}
                          total tournaments{" "}
                        </strong>
                        participated as coach and mentor
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Featured Videos */}
              {professional.videos && professional.videos.length > 0 && (
                <Card className="bg-white">
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

              {/* Achievements */}
              {professional.accomplishments &&
                professional.accomplishments.length > 0 && (
                  <Card className="shadow-elegant">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Award className="w-5 h-5" />
                        Professional Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {professional.accomplishments.map(
                          (achievement, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Star className="w-4 h-4 text-success" />
                              <span className="text-sm">{achievement}</span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Right Column - Contact & Details */}
            <div className="space-y-6">
              {/* Circular Progress Bar */}
              {professional &&
                currentUser &&
                professional.user_id === currentUser.id && (
                  <Card className="bg-white top-8">
                    <CardHeader>
                      <CardTitle className="text-left">
                        Profile Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CircularProgress professional={professional} />
                      <Button
                        className="w-full bg-slate-800 hover:bg-slate-700"
                        onClick={handleUpdateProfile}
                      >
                        Complete Your Profile Now
                      </Button>
                    </CardContent>
                  </Card>
                )}
              {/* Contact Information */}
              <Card className="bg-white top-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-left">
                    Contact Information
                    {isAuthenticated && (
                      <Eye
                        className="w-5 h-5 text-primary cursor-pointer hover:text-primary/80"
                        onClick={handleContactClick}
                      />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Phone className="w-4 h-4 fill-white stroke-black text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-left">
                          {maskPhone("**********")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          WhatsApp Available
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="w-4 h-4 fill-white stroke-black text-accent" />
                      </div>
                      <div>
                        <p className="text-sm">
                          {maskEmail("xxxxxx@xxxxxx.com")}
                        </p>
                      </div>
                    </div>

                    {professional?.instagram_link && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Instagram className="w-4 h-4 fill-white stroke-black text-accent" />
                        </div>
                        <div>
                          <p
                            className="cursor-pointer text-sm"
                            onClick={() => {
                              window.open(
                                professional?.instagram_link,
                                "_blank"
                              );
                            }}
                          >
                            {professional.instagram_link &&
                              professional.instagram_link.replace(
                                "https://www.instagram.com/",
                                "@"
                              )}
                          </p>
                        </div>
                      </div>
                    )}

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
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          View Contact Details
                        </>
                      ) : (
                        "Login to Contact"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Training Locations */}
              {Array.isArray(professional.training_locations_detailed) &&
                professional.training_locations_detailed.length > 0 && (
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <MapPin className="w-4 h-4 text-primary" /> Training
                        Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(professional.training_locations_detailed as any[]).map(
                        (training_location, index) =>
                          (training_location.location ||
                            training_location.address) && (
                            <>
                              <div
                                key={index}
                                className="border rounded-lg p-3 bg-muted"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-left">
                                      {training_location.location}
                                    </p>
                                    <p className="text-xs text-muted-foreground  text-left">
                                      {training_location.address}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  <span>{training_location.timings}</span>
                                </div>
                              </div>
                            </>
                          )
                      )}
                    </CardContent>
                  </Card>
                )}
              {/* Pricing */}
              {professional.one_on_one_price > 0 && (
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <IndianRupee className="w-4 h-4" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Personal Training</span>
                      <span className="flex font-semibold text-primary items-center">
                        <IndianRupee className="w-4 h-4 align-center" />
                        {`${professional.one_on_one_price} / Per Session`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Group Training</span>
                      <span className="flex font-semibold text-primary items-center">
                        <IndianRupee className="w-4 h-4 align-center" />
                        {`${professional.group_session_price} / Per Session`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Online Training</span>
                      <span className="flex font-semibold text-primary items-center">
                        <IndianRupee className="w-4 h-4 align-center" />
                        {`${professional.online_price} / Per Session`}
                      </span>
                    </div>
                    {professional.free_demo_call && (
                      <>
                        <hr />
                        <p className="text-xs text-center text-success font-medium">
                          Free 15-min intro call
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Availability */}
              {professional.coaching_availability && (
                <Card className="shadow-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Clock className="w-4 h-4" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* {professional.coaching_availability && (
                      <>
                        <div>
                          <p className="font-medium text-sm">Mon to Fri</p>
                          <p className="text-xs text-muted-foreground">
                            {professional.availability.weekdays}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Sat & Sun</p>
                          <p className="text-xs text-muted-foreground">
                            {professional.availability.weekends}
                          </p>
                        </div>
                        <Separator />
                      </>
                    )} */}
                    <hr />
                    {professional.coaching_availability &&
                      professional.coaching_availability.length > 0 && (
                        <div className="space-y-2 text-left">
                          {professional.coaching_availability.map(
                            (service, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs mr-2"
                              >
                                {service}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                  </CardContent>
                </Card>
              )}
              {/* {professional.coaching_availability &&
                professional.coaching_availability.length > 0 && (
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle>Available For</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {professional.coaching_availability.map(
                          (availability, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {availability}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )} */}
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

      <ContactDetailsPopup
        open={contactPopupOpen}
        onOpenChange={setContactPopupOpen}
        professionalId={professional?.id || ""}
        professionalName={professional?.name || "Professional"}
      />
    </MainLayout>
  );
};

export default ProfessionalProfile;
