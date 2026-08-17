import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import CompanyIntro from '../components/home/CompanyIntro';
import Services from '../components/home/Services';
import Process from '../components/home/Process';
import TechUniverse from '../components/home/TechUniverse';
import Projects from '../components/home/Projects';
import LearningHub from '../components/home/LearningHub';
import Statistics from '../components/home/Statistics';
import Events from '../components/home/Events';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <div className="bg-white font-sans selection:bg-orange selection:text-white">
      <Helmet>
        <title>EDIZO - Build Digital Products That Matter</title>
        <meta name="description" content="Edizo is a premium software company that designs, develops and launches real digital products. We specialize in web development, mobile apps, UI/UX design, and AI automation." />
      </Helmet>
      
      <main>
        <Hero />
        <CompanyIntro />
        <Services />
        <div id="how-we-work"><Process /></div>
        <TechUniverse />
        <Projects />
        <LearningHub />
        <Statistics />
        <Events />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
};

export default Home;
