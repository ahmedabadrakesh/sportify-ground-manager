import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { ArrayFieldInput } from "./ArrayFieldInput";
import {
  User,
  Camera,
  Video,
  Star,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { TournamentParticipationSection } from "./form-sections/TournamentParticipationSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface StepFiveProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const StepFive = ({ form }: StepFiveProps) => {
  const successStories = form.watch("success_stories") || [];
  const { toast } = useToast();

  // Auto-generate About Me content based on form data
  const generateAboutMe = async () => {
    try {
      const formData = form.getValues();
      const gamesPlayed = formData.games_played?.join(", ");
      const experience = formData.years_of_experience;
      const professionType = formData.profession_type;
      const specialties =
        formData.specialties?.slice(0, 3).join(", ") || "coaching and training";
      const numberOfClientServed = formData.number_of_clients_served;
      const districtLevelTournaments = formData.district_level_tournaments;
      const stateLevelTournaments = formData.state_level_tournaments;
      const nationalLevelTournaments = formData.national_level_tournaments;
      const internationalLevelTournaments =
        formData.international_level_tournaments;

      const aboutMeText = `I am a passionate ${professionType.join(", ").toLowerCase()} with ${experience} years of experience in ${gamesPlayed}. My expertise lies in ${specialties}, till now i served ${numberOfClientServed} clients.

I have participated in numerous tournaments and competitions, which includes District Level - ${districtLevelTournaments}, State Level - ${stateLevelTournaments}, National Level - ${nationalLevelTournaments} and International Level - ${internationalLevelTournaments} bringing real-world experience to my coaching methodology. My approach focuses on not just improving technical skills but also building mental strength and strategic thinking.`;

      toast({
        title: "Generating...",
        description: "Creating your About Me section using AI",
      });

      const { data, error } = await supabase.functions.invoke('generate-about-me', {
        body: { aboutMeText }
      });

      if (error) {
        throw error;
      }

      if (data?.generatedText) {
        form.setValue("about_me", data.generatedText);
        toast({
          title: "Success!",
          description: "Your About Me section has been generated",
        });
      } else {
        throw new Error('No generated text received');
      }

    } catch (error) {
      console.error('Error generating about me:', error);
      toast({
        title: "Error",
        description: "Failed to generate About Me content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addSuccessStory = () => {
    const currentStories = form.getValues("success_stories") || [];
    form.setValue("success_stories", [
      ...currentStories,
      { client_name: "", age: 0, story_details: "" },
    ]);
  };

  const removeSuccessStory = (index: number) => {
    const currentStories = form.getValues("success_stories") || [];
    const newStories = currentStories.filter((_, i) => i !== index);
    form.setValue("success_stories", newStories);
  };

  const updateSuccessStory = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const currentStories = form.getValues("success_stories") || [];
    const newStories = [...currentStories];
    newStories[index] = { ...newStories[index], [field]: value };
    form.setValue("success_stories", newStories);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">About Me</h2>
        <hr className="pb-6" />

        {/* Training Photos */}
        <FormField
          name="images"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Training Photos (Multiple - Upload)
              </FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add training photo URL"
                  label="Training Photos"
                  type="image"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Upload multiple photos showcasing your training sessions,
                facilities, and achievements.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instagram Reels & Training Snippets */}
        <FormField
          name="videos"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Instagram Reels & Training Snippets (Multiple)
              </FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add video/reel URL"
                  label="Training Videos"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Share links to your Instagram reels, training videos, and
                snippets that showcase your coaching style.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* About Me - Auto Generated */}
        <FormField
          name="about_me"
          control={form.control}
          render={({ field }) => (
            <FormItem className="mb-6">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  About Me
                </FormLabel>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={generateAboutMe}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Auto Generate
                </Button>
              </div>
              <FormControl>
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Tell us about yourself, your experience, and what makes you unique as a professional..."
                  className="min-h-[150px]"
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Click "Auto Generate" to create content based on your form data,
                then edit as needed. Use the toolbar for formatting.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Success Stories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg relative"
              >
                <div>
                  <FormLabel>Client Name</FormLabel>
                  <Input
                    placeholder="Client's name"
                    value={story.client_name}
                    onChange={(e) =>
                      updateSuccessStory(index, "client_name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={story.age || ""}
                    onChange={(e) =>
                      updateSuccessStory(
                        index,
                        "age",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <div className="md:col-span-1">
                  <FormLabel>Story Details</FormLabel>
                  <Textarea
                    placeholder="Describe the success story..."
                    value={story.story_details}
                    onChange={(e) =>
                      updateSuccessStory(index, "story_details", e.target.value)
                    }
                    className="min-h-[80px]"
                  />
                </div>
                {successStories.length > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeSuccessStory(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addSuccessStory}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Success Story
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
