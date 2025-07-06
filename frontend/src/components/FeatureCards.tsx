
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Plane, Utensils } from "lucide-react";

export const FeatureCards = () => {
  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-orange-400" />,
      title: "Food Ordering",
      description: "Discover restaurants, browse menus, and place orders with AI recommendations",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop&auto=format",
      gradient: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30"
    },
    {
      icon: <Plane className="w-8 h-8 text-blue-400" />,
      title: "Travel Booking",
      description: "Search flights, book hotels, and plan perfect itineraries with AI assistance",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&auto=format",
      gradient: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-purple-400" />,
      title: "Smart Shopping",
      description: "Browse marketplace of new and used items with personalized recommendations",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&auto=format",
      gradient: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          whileHover={{ scale: 1.05, y: -10 }}
          className="group"
        >
          <Card className={`bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} backdrop-blur-lg overflow-hidden hover:shadow-2xl transition-all duration-300`}>
            <div className="relative h-48 overflow-hidden">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 left-4 p-3 rounded-full bg-black/30 backdrop-blur-sm">
                {feature.icon}
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
