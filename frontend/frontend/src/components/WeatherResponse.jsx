import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, Wind, Droplets, Eye } from "lucide-react";
import gsap from "gsap";

export default function WeatherResponse({ weather }) {
  const cardRef = useRef(null);
  const iconRefs = useRef([]);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      iconRefs.current,
      { scale: 0, rotate: -120 },
      {
        scale: 1,
        rotate: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.8)",
        delay: 0.3,
      }
    );
  }, []);

  const stats = [
    {
      icon: Droplets,
      label: "Humidity",
      value: `${weather.humidity}%`,
      color: "text-blue-200",
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${weather.windSpeed} km/h`,
      color: "text-cyan-200",
    },
    {
      icon: Eye,
      label: "Visibility",
      value: `${weather.visibility} km`,
      color: "text-purple-200",
    },
  ];

  return (
    <Card
      ref={cardRef}
      className="mt-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 border-0 shadow-2xl"
    >
      <CardContent className="p-6 text-white">
        {/* Top section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-4xl font-bold">{weather.temp}°C</h3>
            <p className="text-lg opacity-90">{weather.condition}</p>
          </div>

          <div className="relative">
            <Cloud className="w-20 h-20 opacity-20 absolute -top-2 -left-2" />
            <Sun className="w-16 h-16 relative z-10" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => (iconRefs.current[i] = el)}
              className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xs opacity-80">{stat.label}</p>
              <p className="text-sm font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
