
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Home page
    // We're using "/home" as the path, not "/" which might cause a redirect loop
    navigate("/home", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <video 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="text-center relative z-20">
        <h1 className="text-4xl font-bold mb-4 text-white">Loading...</h1>
        <p className="text-xl text-white/80">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default Index;
