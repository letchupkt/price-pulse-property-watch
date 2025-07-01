
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PropertyTracker from "@/components/PropertyTracker";
import PropertyChart from "@/components/PropertyChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <Hero />
      <PropertyTracker />
      <PropertyChart />
    </div>
  );
};

export default Index;
