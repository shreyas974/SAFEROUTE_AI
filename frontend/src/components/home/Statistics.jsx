import { ShieldCheck, MapPinned, Route, Users } from "lucide-react";
import GlassCard from "../common/GlassCard";

const stats = [
  { id: 1, icon: <ShieldCheck size={26} />, tint: "bg-blue-100 text-blue-600", value: "6,193", label: "Crime Reports Analyzed" },
  { id: 2, icon: <MapPinned size={26} />, tint: "bg-green-100 text-green-600", value: "19", label: "Areas Covered" },
  { id: 3, icon: <Route size={26} />, tint: "bg-orange-100 text-orange-500", value: "312+", label: "Routes Generated" },
  { id: 4, icon: <Users size={26} />, tint: "bg-purple-100 text-purple-600", value: "1,500+", label: "Users Protected" },
];

function Statistics() {
  return (
    <section className="container py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold mb-4">SafeRoute AI in Numbers</h2>
        <p className="text-lg text-[color:var(--text-secondary)]">Data-driven navigation for a safer journey.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <GlassCard key={stat.id} className="p-8 text-center transition-transform duration-300 hover:-translate-y-2">
            <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.tint}`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-[color:var(--text-secondary)]">{stat.label}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

export default Statistics;
