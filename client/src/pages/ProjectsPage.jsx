import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/portfolio`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-gray-500 min-h-screen">Loading projects...</div>;
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <Helmet>
        <title>Our Projects - EDIZO</title>
        <meta name="description" content="Explore our latest projects showcasing our expertise across various domains and technologies." />
      </Helmet>
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-display font-bold mb-6 text-center">
          Our <span className="text-gradient">Work</span>
        </h1>
        <p className="text-xl text-grey-medium max-w-2xl mx-auto text-center mb-16">
          A glimpse of the work we're proud of.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card rounded-3xl overflow-hidden group cursor-pointer flex flex-col h-full"
            >
              <div className={`h-64 ${project.color} relative overflow-hidden flex items-center justify-center`}>
                <div className="w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-2xl font-display font-bold text-white absolute text-center px-4">{project.title}</h3>
              </div>
              <div className="p-8 flex-grow flex flex-col bg-white">
                <span className="text-orange font-bold text-xs uppercase tracking-wider mb-1">{project.category}</span>
                <span className="text-grey-dark font-semibold text-sm mb-3">Client: {project.client}</span>
                <p className="text-grey-medium font-medium leading-relaxed">{project.description}</p>
                
                <div className="mt-auto pt-6 flex items-center text-grey-dark font-bold group-hover:text-orange transition-colors">
                  View Case Study &rarr;
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
