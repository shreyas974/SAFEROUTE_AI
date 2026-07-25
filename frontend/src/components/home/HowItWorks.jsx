import { Search, BrainCircuit, Route } from "lucide-react";
import GlassCard from "../common/GlassCard";

const steps = [
  {
    id: 1,
    icon: <Search size={42} className="text-blue-600" />,
    title: "Search",
    description:
      "Enter your source and destination to begin route planning.",
  },
  {
    id: 2,
    icon: <BrainCircuit size={42} className="text-orange-500" />,
    title: "AI Analysis",
    description:
      "SafeRoute AI analyzes crime data, traffic, and nearby hotspots.",
  },
  {
    id: 3,
    icon: <Route size={42} className="text-green-600" />,
    title: "Safe Route",
    description:
      "Receive the safest and most efficient route with a risk score.",
  },
];

function HowItWorks() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">
          How SafeRoute AI Works
        </h2>

        <p className="text-lg text-[color:var(--text-secondary)]">
          Find a safer route in three simple steps.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <GlassCard
            key={step.id}
            className="text-center transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="flex justify-center mb-5">
              {step.icon}
            </div>

            <h3 className="text-2xl font-semibold mb-3">
              {step.title}
            </h3>

            <p className="text-[color:var(--text-secondary)]">
              {step.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;