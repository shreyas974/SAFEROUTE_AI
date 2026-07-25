import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main className="container min-h-screen py-12">
        <h1 className="text-5xl font-bold mb-4">
          About SafeRoute AI
        </h1>

        <p>
          SafeRoute AI combines machine learning, crime analytics, and intelligent routing to help users travel more safely.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default About;