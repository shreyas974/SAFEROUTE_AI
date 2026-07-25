import { Search, BrainCircuit, Route } from "lucide-react";
import GlassCard from "../common/GlassCard";

const steps = [
  { id: 1, icon: <Search size={28} />, tint: "bg-blue-100 text-blue-600", title: "Search", description: "Enter your source and destination to begin route planning." },
  { id: 2, icon: <BrainCircuit size={28} />, tint: "bg-orange-100 text-orange-500", title: "AI Analysis", description: "SafeRoute AI analyzes crime data, traffic, and nearby hotspots." },
  { id: 3, icon: <Route size={28} />, tint: "bg-green-100 text-green-600", title: "Safe Route", description: "Receive the safest and most efficient route with a risk score." },
];

function HowItWorks() {
  return (
    <section className="container py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold mb-4">How SafeRoute AI Works</h2>
        <p className="text-lg text-[color:var(--text-secondary)]">Find a safer route in three simple steps.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <GlassCard key={step.id} className="relative p-8 text-center transition-transform duration-300 hover:-translate-y-2">
            <span className="absolute top-5 right-6 text-sm font-semibold text-[color:var(--text-secondary)]">0{step.id}</span>
            <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.tint}`}>
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">{step.description}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
