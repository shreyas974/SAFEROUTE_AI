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

      <Hero />

      <Features />

      <HowItWorks />

      <Statistics />

      <CTA />

      <Footer />
    </>
  );
}

export default Home;