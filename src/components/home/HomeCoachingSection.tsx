import { Button } from "@/components/ui/button";
import homeCoachingImg from "@/assets/home-coaching.jpg";

const HomeCoachingSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              GET COACHED AT HOME
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience personalized coaching from the comfort of your own
              home. Our certified coaches provide one-on-one training sessions
              tailored to your space and equipment.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="text-primary">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-foreground">
                  Flexible scheduling that fits your lifestyle
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-primary">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-foreground">
                  Equipment recommendations for home workouts
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-primary">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-foreground">
                  Virtual and in-person coaching options
                </span>
              </div>
            </div>

            <Button variant="hero" size="lg">
              Start Home Coaching
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={homeCoachingImg}
              alt="Home coaching session"
              className="rounded-lg shadow-sport w-full"
            />
            <div className="absolute inset-0 rounded-lg sport-overlay opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeCoachingSection;
