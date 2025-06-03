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
  const socialLinks = [
    {
      url: professional.instagram_link,
      icon: Instagram,
      name: "Instagram",
      color: "pink-600",
    },
    {
      url: professional.facebook_link,
      icon: Facebook,
      name: "Facebook",
      color: "blue-600",
    },
    {
      url: professional.linkedin_link,
      icon: Linkedin,
      name: "LinkedIn",
      color: "blue-600",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@sarahtenniscoach",
      followers: "8.2K",
      color: "red-600",
      description: "Free training videos",
    },
    {
      url: professional.website,
      name: "Website",
      icon: Globe,
      color: "violet-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/sarahtenniscoach",
      followers: "3.7K",
      color: "sky-600",
      description: "Quick tips & updates",
    },
  ];

  // const socialLinks = [
  //   {
  //     name: "Instagram",
  //     icon: Instagram,
  //     url: "https://instagram.com/sarahtenniscoach",
  //     followers: "12.5K",
  //     color: "from-pink-500 to-purple-600",
  //     description: "Daily tips & behind-the-scenes",
  //   },
  //   {
  //     name: "YouTube",
  //     icon: Youtube,
  //     url: "https://youtube.com/@sarahtenniscoach",
  //     followers: "8.2K",
  //     color: "from-red-500 to-red-600",
  //     description: "Free training videos",
  //   },
  //   {
  //     name: "Facebook",
  //     icon: Facebook,
  //     url: "https://facebook.com/sarahtenniscoach",
  //     followers: "5.1K",
  //     color: "from-blue-600 to-blue-700",
  //     description: "Community & events",
  //   },
  //   {
  //     name: "Twitter",
  //     icon: Twitter,
  //     url: "https://twitter.com/sarahtenniscoach",
  //     followers: "3.7K",
  //     color: "from-sky-400 to-blue-500",
  //     description: "Quick tips & updates",
  //   },
  //   {
  //     name: "LinkedIn",
  //     icon: Linkedin,
  //     url: "https://linkedin.com/in/sarahtenniscoach",
  //     followers: "2.1K",
  //     color: "from-blue-700 to-blue-800",
  //     description: "Professional network",
  //   },
  // ];

  const contactMethods = [
    {
      icon: Phone,
      label: "Call/Text",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567",
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
      value: "Los Angeles, CA",
      action: "https://maps.google.com/?q=Los+Angeles+CA",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Stay Connected
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-8"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Follow me on social media for daily tips, training insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Social Media Links */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Follow My Journey</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-white/10 items-center rounded-1xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={`p-3 rounded-xl bg-${social.color} text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {social.icon && <social.icon className="w-6 h-6" />}
                    </div>
                    {/* <div className="ml-4">
                      <h4 className="font-semibold text-lg">{social.name}</h4>
                      <p className="text-blue-200 text-sm">
                        {social.followers} followers
                      </p>
                    </div>*/}
                  </div>
                  {/* <p className="text-blue-100 text-sm">{social.description}</p> */}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
            <div className="space-y-6 mb-8">
              {contactMethods.map((contact, index) => (
                <a
                  key={index}
                  href={contact.action}
                  target={contact.label === "Location" ? "_blank" : undefined}
                  rel={
                    contact.label === "Location"
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center group hover:bg-white/10 p-4 rounded-xl transition-all duration-300"
                >
                  <contact.icon className="w-5 h-5 text-blue-400 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <div className="font-medium text-left">{contact.label}</div>
                    <div className="text-blue-200 text-lg">{contact.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactDetails;
