import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import EuropeToursSection from '@/components/sections/EuropeToursSection';
import TrendingPackagesSection from '@/components/sections/TrendingPackagesSection';
import CTASection from '@/components/sections/CTASection';
import CurrentPackagesSection from '@/components/sections/CurrentPackagesSection';
import FavouriteBooking from '@/components/sections/FavouriteBooking';
import ViewPackagesSection from '@/components/sections/ViewPackagesSection';
import PromotionSection from '@/components/sections/PromotionSection';
import PackagesOnTheBaseOfCategories from '@/components/sections/PackagesOnTheBaseOfCategories';

export default function Home() {
  return (
    <main className="max-w-[1920px]">
      <Header />
      <HeroSection />
      <ServicesSection />
      <CategoriesSection />
      {/* <EuropeToursSection /> */}
      <TrendingPackagesSection />
      {/* <CTASection /> */}
      <CurrentPackagesSection />
      <PackagesOnTheBaseOfCategories/>
      <FavouriteBooking />
      {/* <ViewPackagesSection /> */}
      <PromotionSection />
      <Footer />
    </main>
  );
}
