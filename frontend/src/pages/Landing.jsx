import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Coffee from "@/components/Coffee";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <main data-testid="landing-page" className="relative">
      <Navbar />
      <Hero />
      <Projects />
      <Features />
      <HowItWorks />
      <Coffee />
      <Footer />
    </main>
  );
}
