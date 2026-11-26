import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Why from "@/components/sections/Why";
import DataSection from "@/components/sections/DataSection";
import Compare from "@/components/sections/Compare";
import Pricing from "@/components/sections/Pricing";
import Trust from "@/components/sections/Trust";
import FinalCta from "@/components/sections/FinalCta";
import { Analytics } from "@vercel/analytics/next";
import landing from "@/content/landing.json";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero {...landing.hero} />
        <HowItWorks {...landing.how} demo={landing.hero.demo} />
        <Why {...landing.why} />
        <DataSection {...landing.data} />
        <Compare {...landing.compare} />
        <Pricing {...landing.pricing} />
        <Trust {...landing.trust} />
        <FinalCta {...landing.cta} />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
