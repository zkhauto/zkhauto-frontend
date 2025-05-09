import FeaturedCars from "./ui/FeaturedCars";
import Hero from "./ui/Hero";
import LatestCarsSection from "./ui/LatestCarsSection";
import PopularBrand from "./ui/PopularBrand";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedCars />
      <LatestCarsSection />
      <PopularBrand />
    </div>
  );
};

export default Home;
