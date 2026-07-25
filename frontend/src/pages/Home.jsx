import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Statistics from "../components/home/Statistics";
import CTA from "../components/home/CTA";

function Home() {
  return (
    <>
      <Navbar />
      <div className="space-y-24 md:space-y-32 py-8">
        <Hero />
        <Features />
        <HowItWorks />
        <Statistics />
        <CTA />
      </div>
      <Footer />
    </>
  );
}

export default Home;
