import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Statistics from "../components/home/Statistics";
import CTA from "../components/home/CTA";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b132b] text-slate-100 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1 space-y-20 md:space-y-28 py-6">
        <Hero />
        <Features />
        <HowItWorks />
        <Statistics />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
