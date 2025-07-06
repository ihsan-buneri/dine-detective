import { motion } from "framer-motion";
import { Utensils, Plane, ShoppingCart } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Utensils className="w-12 h-12 text-orange-400" />,
      title: "Food Ordering",
      description: "Discover amazing restaurants, browse detailed menus, and place orders with personalized recommendations from our AI.",
      gradient: "from-orange-500/10 to-red-500/10",
      iconBg: "bg-orange-500/10"
    },
    {
      icon: <Plane className="w-12 h-12 text-blue-400" />,
      title: "Travel Booking",
      description: "Search flights, book hotels, and plan perfect itineraries with intelligent assistance from our travel-specialized AI.",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconBg: "bg-blue-500/10"
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-purple-400" />,
      title: "Smart Shopping",
      description: "Browse our marketplace of new and used products with personalized recommendations based on your profile and preferences.",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconBg: "bg-purple-500/10"
    }
  ];

  return (
    <section id="features" className="relative z-10 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-futuristic">
            Smart <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI revolutionizes how you interact with everyday services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className={`p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300`}>
                <div className={`w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
