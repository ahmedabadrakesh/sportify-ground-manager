
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/models";
import EventBasicDetails from "./EventBasicDetails";
import EventSportSelector from "./EventSportSelector";
import EventLinks from "./EventLinks";
import { useEventForm } from "./useEventForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  event?: Event;
}

const EventDialog = ({ open, onOpenChange, mode, event }: EventDialogProps) => {
  const { form, isSubmitting, onSubmit } = useEventForm({
    mode,
    event,
    onSuccess: () => onOpenChange(false)
  });
  
  const isMobile = useIsMobile();
  
  // For mobile devices, use a Sheet (side drawer) instead of a Dialog
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="h-full overflow-y-auto pt-16">
          <SheetHeader>
            <SheetTitle>
              {mode === "create" ? "Create New Event" : "Edit Event"}
            </SheetTitle>
          </SheetHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <div className="space-y-6">
                <EventBasicDetails form={form} />
                <EventSportSelector form={form} />
                <EventLinks form={form} />
              </div>
              
              <SheetFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : mode === "create" ? "Create Event" : "Update Event"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details to {mode === "create" ? "create a new" : "update the"} event.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <EventBasicDetails form={form} />
            <EventSportSelector form={form} />
            <EventLinks form={form} />
            
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
