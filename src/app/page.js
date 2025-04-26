import FeaturedCars from "./ui/FeaturedCars";
import Hero from "./ui/Hero";
import LatestCarsSection from "./ui/LatestCarsSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCars />
      <LatestCarsSection />
    </div>
  );
};

export default Home;
