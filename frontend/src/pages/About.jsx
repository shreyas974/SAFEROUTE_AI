import { useNavigate } from "react-router-dom";
import {
  MapPinned, Route, BrainCircuit,
  Link2, ExternalLink, Mail, Code2, Database, Sparkles,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import GlassButton from "../components/common/GlassButton";

const techStack = [
  { id: 1, icon: <Code2 size={26} />, tint: "bg-blue-100 text-blue-600", title: "Frontend & Maps", items: "React 19, Vite, Tailwind CSS, Leaflet Maps, Recharts" },
  { id: 2, icon: <Database size={26} />, tint: "bg-orange-100 text-orange-500", title: "Routing API", items: "Flask, OSMnx + NetworkX on the OpenStreetMap road graph, SQLite" },
  { id: 3, icon: <Sparkles size={26} />, tint: "bg-green-100 text-green-600", title: "Models", items: "Per-area, per-time-of-day risk model (scikit-learn), DBSCAN hotspot clustering" },
];

const team = [
  { id: 1, name: "Shreyas", role: "AI/ML, Full Stack & Route Engineering", github: "https://github.com/shreyas974", linkedin: "#", email: "lohi.gs2006@gmail.com" },
  { id: 2, name: "Shanta", role: "Backend Developer & Data Engineering", github: "#", linkedin: "#", email: "#" },
  { id: 3, name: "Syeda", role: "Frontend Developer & UI/UX Design", github: "#", linkedin: "#", email: "#" },
];

function About() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main id="main" className="container min-h-screen py-12">

        {/* Hero */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">About SafeRoute AI</h1>
          <p className="text-lg text-[color:var(--text-secondary)]">
            Built to help people travel with confidence, using data instead of guesswork.
          </p>
        </div>

        {/* Mission */}
        <GlassCard className="p-10 mb-20 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="leading-relaxed">
            Navigation apps optimise for time. SafeRoute AI also shows the trade-off: for each trip it finds the
            fastest route and a lower-risk route on the same real road network, and tells you exactly how many
            minutes the lower-risk one costs and how much exposure it avoids. You choose how much that is worth.
          </p>
        </GlassCard>

        {/* How It Works */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-[color:var(--text-secondary)]">
            From your destination to a safer path, in three steps.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <MapPinned size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Crime Data</h3>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              Incidents are grouped by area and time of day. This build ships a synthetic demo dataset.
            </p>
          </GlassCard>
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <BrainCircuit size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Risk Scoring</h3>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              A model gives each area a 0–1 risk score per time of day. A route's exposure is its length-weighted average.
            </p>
          </GlassCard>
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
              <Route size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Safe Routing</h3>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              Two searches on the OpenStreetMap graph: fastest, and drive time × (1 + preference × risk).
            </p>
          </GlassCard>
        </div>

        {/* Tech Stack */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Built With</h2>
          <p className="text-lg text-[color:var(--text-secondary)]">
            The technology powering SafeRoute AI.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {techStack.map((tech) => (
            <GlassCard key={tech.id} className="p-8 text-center">
              <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${tech.tint}`}>
                {tech.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{tech.title}</h3>
              <p className="text-[color:var(--text-secondary)] leading-relaxed">{tech.items}</p>
            </GlassCard>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">The Team</h2>
          <p className="text-lg text-[color:var(--text-secondary)]">
            The people behind SafeRoute AI.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto mb-20">
          {team.map((member) => (
            <GlassCard key={member.id} className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-[color:var(--text-secondary)] mb-4">{member.role}</p>
              <div className="flex justify-center gap-4">
                {member.github !== "#" ? (
                  <a href={member.github} className="hover:text-blue-600" aria-label={`${member.name} on GitHub`}><Link2 size={20} /></a>
                ) : null}
                {member.linkedin !== "#" ? (
                  <a href={member.linkedin} className="hover:text-blue-600" aria-label={`${member.name} on LinkedIn`}><ExternalLink size={20} /></a>
                ) : null}
                {member.email !== "#" ? (
                  <a href={`mailto:${member.email}`} className="hover:text-blue-600" aria-label={`Email ${member.name}`}><Mail size={20} /></a>
                ) : null}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Data, privacy, limitations */}
        <div className="grid gap-6 lg:grid-cols-3 mb-20 [&>*]:min-w-0">
          <GlassCard id="data" className="p-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">About the data</h2>
            <p className="leading-relaxed mb-3">
              The incidents in this build are <strong>synthetic</strong>: generated with the Faker library
              (<code className="break-all">backend/generate_synthetic_data.py</code>). They are not police records, and the risk scores derived from
              them say nothing about real safety in any neighbourhood.
            </p>
            <p className="leading-relaxed">
              Bengaluru City Police publish aggregate crime counts on the OpenCity data portal, but we found no public
              street-level dataset. Replacing <code className="break-all">data/raw/crime_data.csv</code> with real data (same columns) and retraining
              the model is all it takes to use real figures.
            </p>
          </GlassCard>
          <GlassCard id="privacy" className="p-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Privacy</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>No account is needed. Without one, saved routes stay in this browser.</li>
              <li>Your GPS position is only drawn on the map in your browser; it is never sent to our server.</li>
              <li>Route requests send the two chosen points and the hour. The server keeps no route history.</li>
              <li>If this deployment enables accounts, your name, email, saved routes and optional emergency contact are stored in its Firebase project.</li>
            </ul>
          </GlassCard>
          <GlassCard id="limitations" className="p-8 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-3">Limitations and fairness</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>Risk is assigned per named area (nearest of {"~"}20), not per street, so it changes in steps.</li>
              <li>Drive times are free-flow estimates from speed limits; traffic is not modelled.</li>
              <li>Recorded crime reflects where incidents are reported, not only where they happen. Routing around whole areas
                can stigmatise neighbourhoods, a criticism raised against earlier "safe route" features.</li>
              <li>This is a decision aid, not a guarantee. In an emergency, call 112.</li>
            </ul>
          </GlassCard>
        </div>

        {/* CTA */}
        <GlassCard className="p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Compare your next trip</h2>
          <p className="max-w-2xl mx-auto mb-8 leading-relaxed">
            See the fastest and the lower-risk route side by side, and decide for yourself.
          </p>
          <GlassButton onClick={() => navigate("/dashboard")}>
            Open the map
          </GlassButton>
        </GlassCard>

      </main>
      <Footer />
    </>
  );
}

export default About;
