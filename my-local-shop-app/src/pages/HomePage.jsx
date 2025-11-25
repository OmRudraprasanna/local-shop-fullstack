import React from 'react';

// Import all your components
import Hero from '../components/Hero';
import ShopByCategory from '../components/ShopByCategory';
import PopularShops from '../components/PopularShops';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import CTA from '../components/CTA';

const HomePage = () => {
  return (
    // We only need the <main> part here
    <main>
      <Hero />
      <ShopByCategory />
      <PopularShops />
      <HowItWorks />
      <WhyChooseUs />
      <CTA />
    </main>
  );
};

export default HomePage;