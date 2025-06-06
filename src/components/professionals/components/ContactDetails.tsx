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

const ContactDetails = ({ professional }) => {
  const contactMethods = [
    {
      icon: Phone,
      label: "Call/Text",
      value: professional.contact_number,
      action: `tel:+91${professional.contact_number}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: "sarah@tenniscoach.com",
      action: "mailto:sarah@tenniscoach.com",
    },
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
        <a
          key={index}
          href={contact.action}
          target={contact.label === "Location" ? "_blank" : undefined}
          rel={contact.label === "Location" ? "noopener noreferrer" : undefined}
          className="flex items-center group hover:bg-white/10 p-4 rounded-xl transition-all duration-300"
        >
          <contact.icon className="w-5 h-5 text-blue-800 mr-4 group-hover:scale-110 transition-transform duration-300" />
          {contact.value}
        </a>
      ))}
    </section>
  );
};

export default ContactDetails;
