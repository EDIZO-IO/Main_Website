import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei';

const AnimatedSphere = () => {
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    sphereRef.current.rotation.x = clock.getElapsedTime() * 0.1;
    sphereRef.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  return (
    <Sphere ref={sphereRef} visible args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#FF6A3D"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden flex items-center bg-white">
      {/* Premium subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
      
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Text */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Building Digital Experiences That <span className="text-gradient">Move Businesses Forward</span>
          </h1>
          <p className="text-lg md:text-xl text-grey-medium mb-10 leading-relaxed max-w-xl">
            We transform ideas into powerful digital products through strategy, design, development, and innovation.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-orange hover:bg-orange-dark text-white rounded-full font-semibold transition-all shadow-[0_8px_20px_rgba(255,106,61,0.3)] hover:shadow-[0_8px_25px_rgba(255,106,61,0.5)] transform hover:-translate-y-1">
              Start a Project
            </button>
            <button className="px-8 py-4 bg-white text-grey-dark border border-grey-silver hover:border-orange hover:text-orange rounded-full font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
              Explore Services
            </button>
          </div>
        </motion.div>

        {/* Right Side: 3D Canvas */}
        <div className="h-[500px] lg:h-[700px] relative w-full">
          <Canvas className="w-full h-full">
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} color="#FF4E3D" />
            <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />
            <AnimatedSphere />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
          
          {/* Overlay elements */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-grey-light via-transparent to-transparent z-10" />
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-[#FFF0EB] to-transparent opacity-50 blur-3xl pointer-events-none -z-10" />
    </section>
  );
};

export default Hero;
