
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/models';
import { useToast } from '@/hooks/use-toast';

export const useEvents = () => {
  const { toast } = useToast();
  
  const fetchEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        event_name,
        address,
        city,
        location,
        event_date,
        event_time,
        registration_url,
        sport_id,
        image,
        qr_code,
        created_at,
        updated_at,
        games(id, name)
      `)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error loading events",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    // Transform the data to match our frontend model
    return data.map(item => ({
      id: item.id,
      eventName: item.event_name,
      address: item.address,
      city: item.city,
      location: item.location as { lat: number; lng: number } | undefined,
      eventDate: item.event_date,
      eventTime: item.event_time,
      registrationUrl: item.registration_url,
      sportId: item.sport_id,
      sportName: item.games?.name,
      image: item.image,
      qrCode: item.qr_code,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Transform to snake_case for Supabase
      const { data, error } = await supabase.from('events').insert({
        event_name: eventData.eventName,
        address: eventData.address,
        city: eventData.city,
        location: eventData.location,
        event_date: eventData.eventDate,
        event_time: eventData.eventTime,
        registration_url: eventData.registrationUrl,
        sport_id: eventData.sportId,
        image: eventData.image,
        qr_code: eventData.qrCode
      }).select();

      if (error) {
        throw error;
      }

      toast({
        title: "Event created",
        description: "The event has been successfully created.",
      });
      
      refetch();
      return data[0];
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      // Transform to snake_case for Supabase
      const updateData: any = {};
      if (eventData.eventName) updateData.event_name = eventData.eventName;
      if (eventData.address) updateData.address = eventData.address;
      if (eventData.city) updateData.city = eventData.city;
      if (eventData.location) updateData.location = eventData.location;
      if (eventData.eventDate) updateData.event_date = eventData.eventDate;
      if (eventData.eventTime) updateData.event_time = eventData.eventTime;
      if (eventData.registrationUrl !== undefined) updateData.registration_url = eventData.registrationUrl;
      if (eventData.sportId !== undefined) updateData.sport_id = eventData.sportId;
      if (eventData.image !== undefined) updateData.image = eventData.image;
      if (eventData.qrCode !== undefined) updateData.qr_code = eventData.qrCode;

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Event updated",
        description: "The event has been successfully updated.",
      });
      
      refetch();
      return data[0];
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast({
        title: "Error updating event",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    events: data || [],
    isLoading,
    error,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent
  };
};
