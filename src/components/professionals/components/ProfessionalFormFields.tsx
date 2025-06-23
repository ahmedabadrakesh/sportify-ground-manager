import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProfessionalFormValues } from "../schemas/professionalFormSchema";
import { useGames } from "@/hooks/useGames";
import { Database } from "@/integrations/supabase/types";
import { ArrayFieldInput } from "./ArrayFieldInput";
import { MultiSelectField } from "./MultiSelectField";
import { Mail } from "lucide-react";
import { hasRoleSync } from "@/utils/auth";

// Get the enum types from the database types
type ProfessionType = Database["public"]["Enums"]["sport_profession_type"];
type FeeType = Database["public"]["Enums"]["fee_type"];

interface ProfessionalFormFieldsProps {
  form: UseFormReturn<ProfessionalFormValues>;
  userEmail?: string;
  isUpdate?: boolean;
}

export const ProfessionalFormFields = ({ form, userEmail, isUpdate = false }: ProfessionalFormFieldsProps) => {
  const { games } = useGames();
  const isSuperAdmin = hasRoleSync('super_admin');
  
  // Use the actual enum values from the database
  const professionTypes: ProfessionType[] = [
    "Athlete", "Coach", "Trainer", "Sports Manager", "Support Staff", "Player", "Umpire"
  ];
  
  const feeTypes: FeeType[] = [
    "Per Hour", "Per Day", "Per Match"
  ];

  const levelOptions = ["Beginner", "Intermediate", "Professional"];
  const coachingAvailabilityOptions = ["Personal", "Group", "Home", "Out of City"];

  // Determine if email field should be disabled
  const isEmailDisabled = !isSuperAdmin && !isUpdate && !!userEmail;

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="punch_line"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Punch Line</FormLabel>
              <FormControl>
                <Input {...field} placeholder="A catchy phrase about yourself" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="profession_type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {professionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="game_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game/Sport</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="level"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levelOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Fee Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fee Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="fee"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="fee_type"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <FormField
          name="contact_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={isEmailDisabled}
                  className={isEmailDisabled ? "bg-gray-100 cursor-not-allowed" : ""}
                  placeholder={
                    isSuperAdmin && !isUpdate 
                      ? "Enter email address for new professional" 
                      : "Email address"
                  }
                />
              </FormControl>
              {isEmailDisabled && (
                <p className="text-xs text-muted-foreground">
                  This is your registration email and cannot be changed.
                </p>
              )}
              {isSuperAdmin && !isUpdate && (
                <p className="text-xs text-muted-foreground">
                  Enter the email address for the new sports professional. A user account will be created with this email.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="address"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media & Website</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="website"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://yourwebsite.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="instagram_link"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://instagram.com/yourusername" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="facebook_link"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://facebook.com/yourpage" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="linkedin_link"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://linkedin.com/in/yourprofile" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Professional Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Details</h3>
        
        <FormField
          name="coaching_availability"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <MultiSelectField
                options={coachingAvailabilityOptions}
                value={field.value || []}
                onChange={field.onChange}
                label="Coaching Availability"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="training_locations"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Locations</FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add training location"
                  label="Training Locations"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="awards"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Awards</FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add award"
                  label="Awards"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="accomplishments"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accomplishments</FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add accomplishment"
                  label="Accomplishments"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="certifications"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add certification"
                  label="Certifications"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Media</h3>
        
        <FormField
          name="videos"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Links</FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add video URL"
                  label="Videos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="images"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              <FormControl>
                <ArrayFieldInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add image URL"
                  label="Images"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Comments */}
      <FormField
        name="comments"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comments</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Additional information about yourself..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
