import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import HoroscopeSection from '@/components/home/HoroscopeSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <HoroscopeSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default Index;
