import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';
import CategoryGrid from '../components/CategoryGrid';
import FlashSale from '../components/FlashSale';
import FeaturedProducts from '../components/FeaturedProducts';
import BrandShowcase from '../components/BrandShowcase';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <HeroCarousel />
      <CategoryGrid />
      <FlashSale />
      <FeaturedProducts />
      <BrandShowcase />
    </motion.div>
  );
}
