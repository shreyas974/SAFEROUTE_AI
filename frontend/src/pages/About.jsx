import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, MapPinned, Route, BrainCircuit,
  Link2, ExternalLink, Mail, Code2, Database, Sparkles,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import GlassCard from "../components/common/GlassCard";
import GlassButton from "../components/common/GlassButton";

const techStack = [
  { id: 1, icon: <Code2 size={26} />, tint: "bg-blue-100 text-blue-600", title: "Frontend", items: "React, Vite, Tailwind CSS, Recharts, Leaflet" },
  { id: 2, icon: <Database size={26} />, tint: "bg-orange-100 text-orange-500", title: "Backend", items: "Flask, Python, SQLite" },
  { id: 3, icon: <Sparkles size={26} />, tint: "bg-green-100 text-green-600", title: "AI & Analytics", items: "Crime pattern analysis, risk scoring, route optimization" },
];

const team = [
  { id: 1, name: "Shreyas", role: "AI/ML, Full Stack & Route Engineering", github: "#", linkedin: "#", email: "#" },
  { id: 2, name: "Shanta", role: "Backend Developer", github: "#", linkedin: "#", email: "#" },
  { id: 3, name: "Syeda", role: "Frontend Developer", github: "#", linkedin: "#", email: "#" },
];

function About() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="container min-h-screen py-12">

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
            SafeRoute AI combines machine learning, crime analytics, and intelligent
            routing to help users travel more safely. Instead of relying on the shortest
            or fastest path alone, we analyze historical crime data to recommend routes
            that balance safety, distance, and time — so you can make an informed choice
            before you step out the door.
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
              We collect and analyze historical crime records across the city.
            </p>
          </GlassCard>
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <BrainCircuit size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Risk Scoring</h3>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              Each area and route is scored for risk based on crime patterns and severity.
            </p>
          </GlassCard>
          <GlassCard className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
              <Route size={28} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Safe Routing</h3>
            <p className="text-[color:var(--text-secondary)] leading-relaxed">
              We recommend the route that best balances safety, time, and distance.
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
        <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto mb-20">
          {team.map((member) => (
            <GlassCard key={member.id} className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                {member.name.charAt(0)}
              </div>
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-[color:var(--text-secondary)] mb-4">{member.role}</p>
              <div className="flex justify-center gap-4">
                <a href={member.github} className="hover:text-blue-600"><Link2 size={20} /></a>
                <a href={member.linkedin} className="hover:text-blue-600"><ExternalLink size={20} /></a>
                <a href={`mailto:${member.email}`} className="hover:text-blue-600"><Mail size={20} /></a>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <GlassCard className="p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Travel Safer?</h2>
          <p className="max-w-2xl mx-auto mb-8 leading-relaxed">
            Try SafeRoute AI and plan your next journey with confidence.
          </p>
          <GlassButton onClick={() => navigate("/dashboard")}>
            Find a Safe Route
          </GlassButton>
        </GlassCard>

      </main>
      <Footer />
    </>
  );
}

export default About;
