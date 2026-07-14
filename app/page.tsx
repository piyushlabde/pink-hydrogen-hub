import { AmbientField } from "@/components/ambient/AmbientField";
import { Nav } from "@/components/ui/Nav";
import { Hero } from "@/components/hero/Hero";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { StationMap } from "@/components/map/StationMap";
import { Simulator } from "@/components/simulator/Simulator";
import { Distribution } from "@/components/distribution/Distribution";
import { Narrative } from "@/components/narrative/Narrative";
import { Footer } from "@/components/footer/Footer";

export default function Page() {
  return (
    <>
      <AmbientField />
      <Nav />
      <main id="top" className="relative z-10">
        <Hero />
        <Dashboard />
        <StationMap />
        <Simulator />
        <Distribution />
        <Narrative />
        <Footer />
      </main>
    </>
  );
}
