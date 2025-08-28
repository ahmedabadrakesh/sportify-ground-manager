const ExperienceSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      sport: "Tennis",
      quote:
        "The coaching experience completely transformed my game. I went from beginner to intermediate level in just 3 months!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      sport: "Basketball",
      quote:
        "Professional coaches who really understand the sport. The personalized training plan made all the difference.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      sport: "Swimming",
      quote:
        "Home coaching sessions were perfect for my busy schedule. Highly recommend to anyone looking to improve their fitness.",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          YOUR EXPERIENCE MADE AMAZING
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Don&apos;t just take our word for it. Hear from athletes who have
          achieved their goals with our coaching platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-secondary-600 to-secondary-800 p-8 rounded-lg shadow-sport athletic-transition hover:shadow-glow"
            >
              {/* Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-background"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-background mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author */}
              <div>
                <p className="font-semibold text-background">
                  {testimonial.name}
                </p>
                <p className="text-background text-sm">
                  {testimonial.sport} Athlete
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="bg-secondary/90 p-8 rounded-lg shadow-sport  mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold  text-white/90 mb-2">
                  500+
                </div>
                <p className=" text-white/90  ">Professional Coaches</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white/90 mb-2">
                  10K+
                </div>
                <p className=" text-white/90">Athletes Trained</p>
              </div>
              <div>
                <div className="text-3xl font-bold  text-white/90 mb-2">
                  25+
                </div>
                <p className=" text-white/90">Sports Covered</p>
              </div>
              <div>
                <div className="text-3xl font-bold  text-white/90 mb-2">
                  98%
                </div>
                <p className=" text-white/90">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
