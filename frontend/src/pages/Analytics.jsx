import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function Analytics() {
  return (
    <>
      <Navbar />

      <main className="container min-h-screen py-12">
        <h1 className="text-5xl font-bold mb-4">
          Analytics
        </h1>

        <p>
          Crime statistics and charts will appear here.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Analytics;