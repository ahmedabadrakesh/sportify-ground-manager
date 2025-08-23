import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Phone, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContactDetailsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professionalId: string;
  professionalName: string;
}

interface ContactDetails {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

const ContactDetailsPopup = ({
  open,
  onOpenChange,
  professionalId,
  professionalName,
}: ContactDetailsPopupProps) => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchContactDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sports_professionals")
        .select("contact_number, whatsapp, name")
        .eq("id", professionalId)
        .single();

      if (error) throw error;

      // Since we don't have email in sports_professionals table, we'll use a placeholder
      setContactDetails({
        phone: data.contact_number,
        whatsapp: data.whatsapp || data.contact_number,
        email: `${data.name?.toLowerCase().replace(/\s+/g, '.')}@jokova.com`, // Mock email
      });
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast.error("Failed to fetch contact details");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open && professionalId) {
      fetchContactDetails();
    }
  }, [open, professionalId]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Contact {professionalName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : contactDetails ? (
          <div className="space-y-4">
            {/* Phone Number */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{contactDetails.phone}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(contactDetails.phone || "", "Phone")}
                disabled={!contactDetails.phone}
              >
                {copiedField === "Phone" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{contactDetails.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(contactDetails.email || "", "Email")}
                disabled={!contactDetails.email}
              >
                {copiedField === "Email" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* WhatsApp (if different from phone) */}
            {contactDetails.whatsapp && contactDetails.whatsapp !== contactDetails.phone && (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-green-600">📱</div>
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="font-medium">{contactDetails.whatsapp}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(contactDetails.whatsapp || "", "WhatsApp")}
                >
                  {copiedField === "WhatsApp" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Click copy button to save contact details
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">Contact details not available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsPopup;