import { Button } from "@/components/ui/button";
import corporateWellnessImg from "@/assets/corporate-wellness.jpg";

const CorporateWellness = () => {
  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <img
              src={corporateWellnessImg}
              alt="Corporate wellness program"
              className="rounded-lg shadow-sport w-full"
            />
            <div className="absolute inset-0 rounded-lg sport-overlay opacity-20" />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-bold text-white/90 mb-6">
              ACTIVE LIFESTYLE IS MUST FOR CORPORATE CULTURE
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Boost employee health, productivity, and team spirit through
              professional sports coaching. Find a right coach here.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="text-white/90">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-white/90">
                  Team building through sports activities
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-white/90">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-white/90">
                  Improved employee health and productivity
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-white/90">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-white/90">
                  On-site and virtual wellness programs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateWellness;
