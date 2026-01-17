import { useEffect, useRef } from "react";
import { FaGraduationCap, FaBook, FaLaptop, FaLightbulb, FaRocket } from "react-icons/fa";

export default function AuthVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const size = Math.min(canvas.offsetWidth, canvas.offsetHeight);
      canvas.width = size;
      canvas.height = size;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle system
    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }

    const particles: Particle[] = [];
    const particleCount = 12;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    // Create particles within circular bounds
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius * 0.7;
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: Math.random() * 2.5 + 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.5,
        color: `rgba(139, 92, 246, ${Math.random() * 0.4 + 0.5})`, // Brighter purple6
      });
    }

    // Animation loop
    const animate = () => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Clip to circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Check if particle is within circular bounds
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > radius - particle.radius) {
          // Bounce off circular edge
          const angle = Math.atan2(dy, dx);
          particle.x = centerX + Math.cos(angle) * (radius - particle.radius);
          particle.y = centerY + Math.sin(angle) * (radius - particle.radius);
          
          // Reflect velocity
          const normalX = Math.cos(angle);
          const normalY = Math.sin(angle);
          const dot = particle.speedX * normalX + particle.speedY * normalY;
          particle.speedX -= 2 * dot * normalX;
          particle.speedY -= 2 * dot * normalY;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw brighter connections
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.25 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Icons to display - subtle and minimal
  const icons = [
    { Icon: FaGraduationCap, delay: 0 },
    { Icon: FaBook, delay: 0.3 },
    { Icon: FaLaptop, delay: 0.6 },
    { Icon: FaLightbulb, delay: 0.9 },
    { Icon: FaRocket, delay: 1.2 },
  ];

  return (
    <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
      <div className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full overflow-hidden">
        {/* Subtle gradient background */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0, 0, 0, 0.1) 100%)",
          }}
        />

        {/* Animated background canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-full"
        />

        {/* Floating icons - brighter */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-8 sm:gap-10 p-8 h-full">
          {icons.map(({ Icon, delay }, index) => (
            <div
              key={index}
              className="text-purple6/50 hover:text-purple6/70 transition-all duration-700"
              style={{
                animation: `float 6s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <Icon className="text-3xl sm:text-4xl lg:text-5xl" />
            </div>
          ))}
        </div>

        {/* Add CSS animation */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.5;
            }
            50% {
              transform: translateY(-15px) scale(1.05);
              opacity: 0.7;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
