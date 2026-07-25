import { ShieldCheck, MapPinned, Route, Users } from "lucide-react";
import GlassCard from "../common/GlassCard";

const stats = [
  {
    id: 1,
    icon: <ShieldCheck size={40} className="text-blue-600" />,
    value: "128+",
    label: "Crime Reports Analyzed",
  },
  {
    id: 2,
    icon: <MapPinned size={40} className="text-green-600" />,
    value: "45",
    label: "Safe Zones",
  },
  {
    id: 3,
    icon: <Route size={40} className="text-orange-500" />,
    value: "312+",
    label: "Routes Generated",
  },
  {
    id: 4,
    icon: <Users size={40} className="text-purple-600" />,
    value: "1,500+",
    label: "Users Protected",
  },
];

function Statistics() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">
          SafeRoute AI in Numbers
        </h2>

        <p className="text-lg text-[color:var(--text-secondary)]">
          Data-driven navigation for a safer journey.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard
            key={stat.id}
            className="text-center transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="flex justify-center mb-4">
              {stat.icon}
            </div>

            <h3 className="text-4xl font-bold mb-2">
              {stat.value}
            </h3>

            <p className="text-[color:var(--text-secondary)]">
              {stat.label}
            </p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default Statistics;