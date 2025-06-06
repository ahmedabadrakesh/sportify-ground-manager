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
  CirclePlus,
  Quote,
  Youtube,
  BadgeIndianRupee,
  LucideTextQuote,
} from "lucide-react";
import About from "@/components/professionals/components/About";
import VideoGallery from "@/components/professionals/components/VideoGallery";
import ImageGallery from "@/components/professionals/components/ImageGallery";
import ContactDetails from "@/components/professionals/components/ContactDetails";

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [isAboutRReadMoreOpened, setIsAboutRReadMoreOpened] =
    useState<boolean>(false);
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
        <CardContent>
          {items.map((achievement, index) => (
            <div className="flex">
              {achievement}
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
        color: "pink-600",
      },
      {
        url: professional.facebook_link,
        icon: <Facebook className="h-5 w-5" />,
        name: "Facebook",
        color: "blue-600",
      },
      {
        url: professional.linkedin_link,
        icon: <Linkedin className="h-5 w-5" />,
        name: "LinkedIn",
        color: "blue-600",
      },
      {
        url: professional.website,
        icon: <Globe className="h-5 w-5" />,
        name: "Website",
        color: "green-600",
      },
      {
        name: "YouTube",
        icon: <Youtube className="h-5 w-5" />,
        url: "https://youtube.com/@jokova.official",
        followers: "8.2K",
        color: "red-600",
        description: "Free training videos",
      },
    ];

    const activeLinks = links.filter((link) => link.url);

    if (activeLinks.length === 0) return null;

    return (
      <div className="flex flex-wrap items-baseline gap-4">
        {activeLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center justify-center">
              <div
                className={`p-3 rounded-xl bg-${link.color} text-white group-hover:scale-110`}
              >
                {link.icon}
              </div>
            </div>
          </a>
        ))}
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
    return str.split(" ").slice(0, count).join(" ") + " ... ";
  };

  const showOrangeDividerLine = () => {
    return (
      <div className="pb-6 pt-6">
        {
          <hr className="w-48 h-1 mx-auto my-2 bg-orange-300 border-0 rounded-sm md:my-4 dark:bg-gray-700" />
        }
      </div>
    );
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
            <div className="flex lg:flex-row flex-col items-center lg:gap-16">
              <div className="flex place-content-center items-center">
                <Avatar className="w-64 h-64">
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
              </div>
              <div className="lg:flex-col md:flex-col  items-center">
                <div className="lg:flex md:inline-flex flex-row lg:content-left lg:items-left space-x-2 mt-2">
                  <p className="text-2xl ">
                    {`${professional.name} `}
                    <div className="inline-flex items-center">
                      <span
                        className="bg-blue-500 rounded-full p-1"
                        title="Verified"
                      >
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
                  </p>
                </div>
                <div className="flex items-left space-x-2 mt-2">
                  <p className="flex text-xl sm:text-xl italic lg:text-2xl items-center font-light mb-6">
                    <Quote size={16} color="#6260e2" fill="#111" />
                    {professional.punch_line}
                    <Quote size={16} color="#6260e2" fill="#111" />
                  </p>
                </div>
                <div className="lg:flex md:grid items-center flex-wrap gap-2 mb-4">
                  <Badge
                    variant="default"
                    className="flex items-center gap-2 px-4 py-2 mb-4"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{professional.city}</span>
                  </Badge>
                  {professional.profession_type && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-2 px-4 py-2 ring-1 ring-green-700 ring-inset mb-4"
                    >
                      <Star className="h-3 w-3" />
                      {professional.profession_type}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="flex items-left gap-2 px-4 py-2 ring-1 ring-green-700 ring-inset mb-4"
                  >
                    <LandPlot className="w-4 h-4 text-green-400" />
                    {professional.games?.name}
                  </Badge>
                  {professional.level && (
                    <Badge
                      variant="secondary"
                      className="flex items-left gap-2 px-4 py-2 ring-1 ring-green-700 ring-inset mb-4"
                    >
                      <Star className="h-3 w-3" />
                      {professional.level}
                    </Badge>
                  )}
                </div>
                <div>
                  <div className="lg:grid lg:col-span-5 md:flex leading-relaxed align-left text-left">
                    {renderSocialLinks()}
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-6 pt-6">
              <hr className="w-48 h-1 mx-auto my-4 bg-blue-400 border-0 rounded-sm md:my-10 dark:bg-gray-700" />
            </div>
            {professional.comments && (
              <div>
                <div className="lg:grid lg:grid-cols-6 gap-4 md:flex-flow-row">
                  <div className="lg:col-span-1 md:col-span-1 text-left uppercase">
                    About me
                  </div>
                  <div className="lg:col-span-5  md:col-span-1 leading-relaxed align-left text-justify">
                    {isAboutRReadMoreOpened
                      ? `${professional.comments} `
                      : getFiftyWords(professional.comments, 50)}
                    <a
                      onClick={() =>
                        setIsAboutRReadMoreOpened(!isAboutRReadMoreOpened)
                      }
                      className="cursor-pointer inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {isAboutRReadMoreOpened ? "Read Less" : "Read More"}
                      <svg
                        className="w-4 h-4 ms-2 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                {showOrangeDividerLine()}
              </div>
            )}

            {professional.awards.length !== 0 && (
              <>
                <div className="grid lg:grid-cols-6 gap-4">
                  <div className="grid col-span-1 md:col-span-1 text-left uppercase">
                    Awads
                  </div>
                  <div className="lg:col-span-5 md:col-span-1 leading-relaxed align-left text-justify">
                    {professional.awards.map((item, index) => {
                      return (
                        <div className="flex items-center">
                          <CirclePlus
                            color="#6260e2"
                            className="mr-2 "
                            size={20}
                          />
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {showOrangeDividerLine()}
              </>
            )}
            {professional.accomplishments.length !== 0 && (
              <>
                <div className="grid lg:grid-cols-6 gap-4 md:grid-flow-row">
                  <div className="grid col-span-1 text-left uppercase">
                    Accomplishments
                  </div>
                  <div className="lg:col-span-5 md:col-span-1 leading-relaxed align-left text-justify">
                    {professional.accomplishments.map((item, index) => {
                      return (
                        <div className="flex items-center">
                          <CirclePlus
                            color="#6260e2"
                            className="mr-2 "
                            size={20}
                          />
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {showOrangeDividerLine()}
              </>
            )}

            {professional.certifications.length !== 0 && (
              <>
                <div className="grid lg:grid-cols-6 gap-4">
                  <div className="grid col-span-1 text-left uppercase">
                    Certifications
                  </div>
                  <div className="lg:col-span-5 gap-2 leading-relaxed align-left text-justify">
                    {professional.certifications.map((item, index) => {
                      return (
                        <div className="flex items-center">
                          <CirclePlus
                            color="#6260e2"
                            className="mr-2 "
                            size={20}
                          />
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {showOrangeDividerLine()}
              </>
            )}
            {professional.training_locations.length !== 0 && (
              <>
                <div className="grid lg:grid-cols-6 gap-4">
                  <div className="grid col-span-1 text-left uppercase">
                    Training locations
                  </div>
                  <div className="grid col-span-5 leading-relaxed align-left text-justify">
                    {professional.training_locations.map((item, index) => {
                      return (
                        <div className="flex items-center">
                          <CirclePlus
                            color="#6260e2"
                            className="mr-2 "
                            size={20}
                          />
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {showOrangeDividerLine()}
              </>
            )}

            <div>
              <div className="grid lg:grid-cols-6 gap-4">
                <div className="grid col-span-1 text-left uppercase">
                  Charges
                </div>
                <div className="lg:col-span-5 leading-relaxed align-left text-justify">
                  <div className="flex items-center gap-2">
                    <BadgeIndianRupee size={16} color="#6260e2 " />
                    {`${professional.fee}/- ${professional.fee_type}`}
                  </div>
                </div>
              </div>
              {showOrangeDividerLine()}
            </div>

            {professional.coaching_availability.length !== 0 && (
              <>
                <div className="grid lg:grid-cols-6 gap-4">
                  <div className="grid col-span-1 text-left uppercase">
                    coaching availability
                  </div>
                  <div className="grid col-span-5 leading-relaxed align-left text-justify">
                    {professional.coaching_availability.map((item, index) => {
                      return (
                        <div className="flex items-center">
                          <CirclePlus
                            color="#6260e2"
                            className="mr-2 "
                            size={20}
                          />
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {showOrangeDividerLine()}
              </>
            )}
            <div>
              <div className="grid lg:grid-cols-6 md:grid-cols-1 gap-4 md:grid-flow-row">
                <div className="grid lg:col-span-1 text-left uppercase">
                  Featured Gallery
                </div>
                <div className="grid lg:col-span-5 text-left leading-relaxed align-left">
                  Moments from training sessions, tournaments, and student
                  achievements
                  <ImageGallery images={professional.images} />
                </div>
              </div>
              {showOrangeDividerLine()}
            </div>

            <div>
              <div className="grid lg:grid-cols-6 gap-2 md:grid-flow-row">
                <div className="grid col-span-1 text-left uppercase">
                  Featured Videos
                </div>
                <div className="grid lg:col-span-5 text-left leading-relaxed align-left">
                  Free training content to help you improve your game
                  <VideoGallery videos={professional.videos} />
                </div>
              </div>
              {showOrangeDividerLine()}
            </div>

            <div className="grid lg:grid-cols-6 gap-4">
              <div className="grid col-span-1 text-left uppercase">
                Contact Details
              </div>
              <div className="grid col-span-5 leading-relaxed align-left text-justify">
                <ContactDetails professional={professional} />
              </div>
            </div>

            <div className="grid lg:grid-cols-6 gap-4">
              <div className="grid col-span-1 text-left uppercase"></div>
              <div className="grid col-span-5 leading-relaxed align-left text-justify"></div>
            </div>

            <div className="grid lg:grid-cols-6 gap-4">
              <div className="grid col-span-1 text-left uppercase"></div>
              <div className="grid col-span-5 leading-relaxed align-left text-justify"></div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfile;
