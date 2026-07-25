import { useNavigate } from "react-router-dom";
import GlassCard from "../common/GlassCard";
import GlassButton from "../common/GlassButton";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="container py-20">
      <GlassCard className="p-12 text-center">
        <h2 className="mb-6 text-5xl font-bold">
          Ready to Travel Safer?
        </h2>

        <p className="mx-auto mb-8 max-w-3xl text-lg text-[color:var(--text-secondary)]">
          Experience intelligent route planning powered by AI, crime analytics,
          and real-time safety insights. Start your safer journey today.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <GlassButton onClick={() => navigate("/dashboard")}>
            Find Safe Route
          </GlassButton>

          <GlassButton
            variant="secondary"
            onClick={() => navigate("/analytics")}
          >
            View Analytics
          </GlassButton>
        </div>
      </GlassCard>
    </section>
  );
}

export default CTA;