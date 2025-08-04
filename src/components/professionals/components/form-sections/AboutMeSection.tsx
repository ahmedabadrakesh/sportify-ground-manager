import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalFormValues } from "../../schemas/professionalFormSchema";
import { Plus, X, Sparkles } from "lucide-react";

interface AboutMeSectionProps {
  form: UseFormReturn<ProfessionalFormValues>;
}

export const AboutMeSection = ({ form }: AboutMeSectionProps) => {
  const successStories = form.watch("success_stories") || [];

  const addSuccessStory = () => {
    const current = form.getValues("success_stories") || [];
    form.setValue("success_stories", [...current, { client_name: "", age: 0, story_details: "" }]);
  };

  const removeSuccessStory = (index: number) => {
    const current = form.getValues("success_stories") || [];
    form.setValue("success_stories", current.filter((_, i) => i !== index));
  };

  const generateAboutMe = () => {
    const values = form.getValues();
    const about = `Professional ${values.profession_type} with ${values.years_of_experience || 0} years of experience in ${values.game_id}. ${values.academy_name ? `Associated with ${values.academy_name}.` : ''} ${values.specialties?.length ? `Specializes in ${values.specialties.join(', ')}.` : ''} ${values.accomplishments?.length ? `Notable achievements include ${values.accomplishments.slice(0, 2).join(' and ')}.` : ''}`.trim();
    
    form.setValue("about_me", about);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">About Me</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={generateAboutMe}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Auto-Generate
        </Button>
      </div>
      
      <FormField
        name="about_me"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>About Me *</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Tell us about yourself, your coaching philosophy, and what makes you unique..."
                rows={6}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium">Success Stories</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addSuccessStory}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Story
          </Button>
        </div>

        {successStories.map((_, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Success Story {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSuccessStory(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  name={`success_stories.${index}.client_name`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Client's name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name={`success_stories.${index}.age`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                          value={field.value || 0}
                          placeholder="Client's age"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name={`success_stories.${index}.story_details`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe the client's journey and success..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        {successStories.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>No success stories added yet.</p>
            <p className="text-sm">Click "Add Story" to share your client success stories.</p>
          </div>
        )}
      </div>
    </div>
  );
};