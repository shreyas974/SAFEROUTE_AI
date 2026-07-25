import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="container flex min-h-[85vh] items-center justify-center">
      <GlassCard className="max-w-4xl p-12 text-center fade-up">
        <h1 className="mb-6 text-6xl font-bold leading-tight">
          Navigate Smarter.
          <br />
          Travel Safer.
        </h1>

        <p className="mx-auto mb-8 max-w-3xl text-xl">
          SafeRoute AI helps you choose safer routes using crime analytics,
          intelligent path optimization, and AI-powered risk prediction.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <GlassButton onClick={() => navigate("/dashboard")}>
            Find Safe Route
          </GlassButton>

          <GlassButton
            variant="secondary"
            onClick={() => navigate("/about")}
          >
            Learn More
          </GlassButton>
        </div>
      </GlassCard>
    </section>
  );
}

export default Hero;