import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '', email: '', company: '', service: '', budget: '', message: ''
  });

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-24 bg-grey-light">
      <div className="container mx-auto px-6">
        <div className="glass rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative">
          <div className="grid lg:grid-cols-5 h-full">
            
            {/* Left Side: Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-orange to-orange-dark p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-3xl font-display font-bold mb-4">Let's build something amazing together.</h3>
                <p className="text-white/80 mb-12 text-lg">Reach out to us to discuss your project, our services, or internship opportunities.</p>
                
                <div className="space-y-8 mt-auto">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">Email Us</p>
                      <p className="font-semibold text-lg">hello@edizo.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">Call Us</p>
                      <p className="font-semibold text-lg">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm font-medium mb-1">Visit Us</p>
                      <p className="font-semibold text-lg">Tech Hub, Bangalore, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-3 p-12 bg-white">
              <h3 className="text-2xl font-bold text-grey-dark mb-8">Send us a message</h3>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input type="text" name="name" id="name" required value={formState.name} onChange={handleChange} className="block px-2.5 pb-2.5 pt-4 w-full text-grey-dark bg-transparent rounded-lg border-2 border-grey-silver appearance-none focus:outline-none focus:ring-0 focus:border-orange peer" placeholder=" " />
                  <label htmlFor="name" className="absolute text-grey-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Full Name</label>
                </div>

                <div className="relative">
                  <input type="email" name="email" id="email" required value={formState.email} onChange={handleChange} className="block px-2.5 pb-2.5 pt-4 w-full text-grey-dark bg-transparent rounded-lg border-2 border-grey-silver appearance-none focus:outline-none focus:ring-0 focus:border-orange peer" placeholder=" " />
                  <label htmlFor="email" className="absolute text-grey-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Email Address</label>
                </div>

                <div className="relative">
                  <input type="text" name="company" id="company" value={formState.company} onChange={handleChange} className="block px-2.5 pb-2.5 pt-4 w-full text-grey-dark bg-transparent rounded-lg border-2 border-grey-silver appearance-none focus:outline-none focus:ring-0 focus:border-orange peer" placeholder=" " />
                  <label htmlFor="company" className="absolute text-grey-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Company (Optional)</label>
                </div>

                <div className="relative">
                  <select name="service" id="service" required value={formState.service} onChange={handleChange} className="block px-2.5 pb-2.5 pt-4 w-full text-grey-dark bg-transparent rounded-lg border-2 border-grey-silver appearance-none focus:outline-none focus:ring-0 focus:border-orange peer">
                    <option value="" disabled hidden></option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">UI/UX Design</option>
                    <option value="ai">AI Integration</option>
                    <option value="internship">Internship</option>
                  </select>
                  <label htmlFor="service" className="absolute text-grey-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Service Needed</label>
                </div>

                <div className="relative md:col-span-2">
                  <textarea name="message" id="message" rows="4" required value={formState.message} onChange={handleChange} className="block px-2.5 pb-2.5 pt-4 w-full text-grey-dark bg-transparent rounded-lg border-2 border-grey-silver appearance-none focus:outline-none focus:ring-0 focus:border-orange peer" placeholder=" "></textarea>
                  <label htmlFor="message" className="absolute text-grey-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-8 peer-placeholder-shown:top-12 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Message Details</label>
                </div>

                <div className="md:col-span-2 mt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-orange text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-orange/50 transition-all"
                  >
                    Send Message
                  </motion.button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
