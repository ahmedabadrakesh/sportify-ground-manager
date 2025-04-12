
import { Search, MapPin, Info } from "lucide-react";

const WhyChooseUsSection = () => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Why Choose SportifyGround?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Easy Discovery</h3>
          <p className="text-gray-600">
            Find the perfect ground for your sport in your vicinity with our powerful search.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nearby Locations</h3>
          <p className="text-gray-600">
            Discover sports grounds near you with detailed information and facilities.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Instant Booking</h3>
          <p className="text-gray-600">
            Book your slot in minutes with our seamless booking system and secure payments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;
