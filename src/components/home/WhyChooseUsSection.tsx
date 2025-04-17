
import { Search, MapPin, Info, Shield, Clock, CreditCard, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Search size={24} />,
    title: "Easy Discovery",
    description: "Find the perfect ground for your sport in your vicinity with our powerful search."
  },
  {
    icon: <MapPin size={24} />,
    title: "Nearby Locations",
    description: "Discover sports grounds near you with detailed information and facilities."
  },
  {
    icon: <Info size={24} />,
    title: "Detailed Information",
    description: "Get comprehensive details about each ground including amenities and photos."
  },
  {
    icon: <Clock size={24} />,
    title: "Real-time Availability",
    description: "Check slot availability in real-time and book instantly without waiting."
  },
  {
    icon: <CreditCard size={24} />,
    title: "Secure Payments",
    description: "Make payments securely through our trusted payment gateway partners."
  },
  {
    icon: <Shield size={24} />,
    title: "Verified Venues",
    description: "All sports grounds are verified and regularly audited for quality assurance."
  }
];

const WhyChooseUsSection = () => {
  return (
    <div className="mb-16">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose SportifyGround?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're committed to providing the best booking experience for sports enthusiasts
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 text-primary-600 font-medium">
          <ThumbsUp size={20} />
          <span>Over 98% customer satisfaction rate</span>
        </div>
      </motion.div>
    </div>
  );
};

export default WhyChooseUsSection;
