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
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <div className="bg-grey-light dark:bg-[#060B13] font-sans transition-colors duration-500 selection:bg-orange selection:text-white">
      <Helmet>
        <title>EDIZO - Web & Mobile App Development | Digital Product Design Agency</title>
        <meta name="description" content="EDIZO is a premier digital product design and web development agency. We build custom web applications, mobile apps, SaaS software, and scalable digital solutions for modern brands." />
        <link rel="canonical" href="https://edizotech.in/" />
      </Helmet>
      
      <div className="home-content">
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
        <FAQ />
        <CTA />
      </div>
    </div>
  );
};

export default Home;
