import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { getCurrentUserSync } from "@/utils/auth";

interface ContactDetailsProps {
  professional: any;
  onLoginClick?: () => void;
}

const ContactDetails = ({
  professional,
  onLoginClick,
}: ContactDetailsProps) => {
  const currentUser = getCurrentUserSync();
  const isAuthenticated = !!currentUser;

  // Mask contact info for non-authenticated users
  const maskEmail = (email: string) => {
    if (!email || isAuthenticated) return email;
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.length > 2
        ? username.substring(0, 2) + "*".repeat(username.length - 2)
        : username;
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone || isAuthenticated) return phone;
    if (phone.length <= 4) return phone;
    return (
      phone.substring(0, 2) +
      "*".repeat(phone.length - 4) +
      phone.substring(phone.length - 2)
    );
  };

  const contactMethods = [
    {
      icon: MapPin,
      label: "Location",
      value: `${professional.address}, ${professional.city}`,
      action: `https://maps.google.com/?q=${professional.city}`,
    },
  ];

  return (
    <section>
      {/* Contact Information */}
      {contactMethods.map((contact, index) => (
        <div key={index}>
          {isAuthenticated || contact.label === "Location" ? (
            <a
              href={contact.action}
              target={contact.label === "Location" ? "_blank" : undefined}
              rel={
                contact.label === "Location" ? "noopener noreferrer" : undefined
              }
              className="flex items-center group hover:bg-white/10 p-1 rounded-xl transition-all duration-300"
            >
              <contact.icon className="w-5 h-5 text-blue-800 mr-4 group-hover:scale-110 transition-transform duration-300" />
              {contact.value}
            </a>
          ) : (
            <div className="flex items-center p-1 rounded-xl">
              <contact.icon className="w-5 h-5 text-blue-800 mr-4" />
              <span className="text-gray-600">{contact.value}</span>
              <button
                onClick={onLoginClick}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                (Login to view)
              </button>
            </div>
          )}
        </div>
      ))}

      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Complete contact details are available after registration.
          </p>
        </div>
      )}
    </section>
  );
};

export default ContactDetails;
