
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEvents } from "@/hooks/useEvents";
import { useGames } from "@/hooks/useGames";
import { Event } from "@/types/models";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  event?: Event;
}

const eventFormSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  eventDate: z.string().min(1, "Date is required"),
  eventTime: z.string().min(1, "Time is required"),
  registrationUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  sportId: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  qrCode: z.string().url("Invalid QR code URL").optional().or(z.literal(""))
});

const EventDialog = ({ open, onOpenChange, mode, event }: EventDialogProps) => {
  const { createEvent, updateEvent } = useEvents();
  const { games } = useGames();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format the date value for the form
  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(parseISO(dateStr), 'yyyy-MM-dd');
    } catch (e) {
      return dateStr;
    }
  };
  
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: event?.eventName || "",
      address: event?.address || "",
      city: event?.city || "",
      eventDate: formatDateForInput(event?.eventDate) || "",
      eventTime: event?.eventTime || "",
      registrationUrl: event?.registrationUrl || "",
      sportId: event?.sportId || "",
      image: event?.image || "",
      qrCode: event?.qrCode || ""
    }
  });
  
  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    try {
      setIsSubmitting(true);
      if (mode === "create") {
        await createEvent(values);
      } else if (mode === "edit" && event) {
        await updateEvent(event.id, values);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting event form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sportId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">General</SelectItem>
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
              control={form.control}
              name="registrationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/register" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="qrCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/qrcode.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "create" ? "Create Event" : "Update Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
