import { ShieldCheck, MapPinned, Route } from "lucide-react";
import GlassCard from "../common/GlassCard";

const features = [
  {
    id: 1,
    icon: <ShieldCheck size={40} className="text-blue-600" />,
    title: "AI Risk Prediction",
    description:
      "Predicts the safest route using historical crime patterns and AI analysis.",
  },
  {
    id: 2,
    icon: <MapPinned size={40} className="text-orange-500" />,
    title: "Crime Heatmaps",
    description:
      "Visualize crime-prone areas on an interactive map before you travel.",
  },
  {
    id: 3,
    icon: <Route size={40} className="text-green-600" />,
    title: "Smart Route Optimization",
    description:
      "Balances safety, travel time, and distance to recommend the best route.",
  },
];

function Features() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">
          Why Choose SafeRoute AI?
        </h2>

        <p className="text-lg text-[color:var(--text-secondary)] max-w-3xl mx-auto">
          Travel with confidence using AI-powered insights and crime analytics.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <GlassCard
            key={feature.id}
            className="text-center transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="flex justify-center mb-5">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-semibold mb-3">
              {feature.title}
            </h3>

            <p className="text-[color:var(--text-secondary)]">
              {feature.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default Features;