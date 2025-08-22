const FeaturedSection = () => {
  const features = [
    {
      title: "Find Your Coach",
      description:
        "Browse through our extensive list of sports and find the perfect coach for your needs. Use in-built filters to find the perfect coach for you!",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Connect with Coach",
      description:
        "Easily Register yourself, up for getting started! Connect with a coach directly and check if he is offering a trial session and begin your personalized training journey today.",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: "Start Training",
      description:
        "Take your first steps into the sport of your choice! have a hassle-free, memorable experience learning your favorite sport. ",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 px-4 bg-secondary">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white/90 mb-4">
          IT&apos;S SUPER EASY TO GET STARTED
        </h2>
        <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join thousands of athletes who have transformed their game with our
          professional coaching platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-lg shadow-sport athletic-transition hover:shadow-glow"
            >
              <div className="text-primary mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
