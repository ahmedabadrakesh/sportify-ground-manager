import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

const Index = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make stats visible after a short delay for animation effect
    const timer = setTimeout(() => {
      setVisible(true);
    }, 500);

    // Redirect to the Home page after animation
    const redirectTimer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src="/lovable-uploads/abf3239e-af73-47ea-9adc-c6138959a349.png" 
          alt="Sports Team Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center relative z-20 flex flex-col items-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
            <div className="text-4xl font-bold text-white">
              {visible ? <CountUp end={100} duration={2.5} /> : 0}
            </div>
          </div>
        </div>
        <div className="px-4 py-1 bg-white/20 rounded-full mb-2 text-white">
          Loading...
        </div>
        <p className="text-sm text-white/80">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default Index;
