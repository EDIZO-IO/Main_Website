import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InternshipApplication = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/internships/${id}`);
        if (!res.ok) throw new Error('Not found');
        const internship = await res.json();
        setData(internship);
      } catch (err) {
        console.error("Failed to fetch internship details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <h1 className="text-4xl font-bold">Internship not found</h1>
        <Link to="/internships" className="text-orange hover:underline mt-4 inline-block">Return to Internships</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to submit an application.");
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
      const res = await fetch(`${API_URL}/api/users/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          internship_id: id,
          status: 'pending'
        })
      });

      if (!res.ok) throw new Error('Failed to submit application');
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#F8FAFC] min-h-screen relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6 max-w-3xl">
        <Link to={`/internships/${id}`} className="inline-flex items-center text-grey-medium hover:text-orange mb-8 transition-colors font-medium">
          <ArrowLeft size={20} className="mr-2" /> Back to Details
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden shadow-sm border border-gray-100">
          
          {isSubmitted ? (
            <div className="text-center py-16">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-grey-dark mb-4">Application Received!</h2>
              <p className="text-grey-medium mb-8 max-w-md mx-auto">
                Thank you for applying to the <strong>{data.title}</strong> program. Our team will review your application and get back to you shortly.
              </p>
              <Link to="/dashboard" className="inline-block px-8 py-4 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-colors shadow-sm">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-bold text-xs mb-4 uppercase tracking-wider">
                  {data.category || 'Engineering'} Program
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-grey-dark">
                  Apply for {data.title}
                </h1>
                <p className="text-grey-medium">Fill out the form below to start your journey with Edizo Academy.</p>
                {error && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-grey-dark">First Name</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-orange focus:outline-none transition-colors bg-gray-50 focus:bg-white text-grey-dark" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-grey-dark">Last Name</label>
                    <input type="text" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-orange focus:outline-none transition-colors bg-gray-50 focus:bg-white text-grey-dark" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-grey-dark">Email Address</label>
                  <input type="email" required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-orange focus:outline-none transition-colors bg-gray-50 focus:bg-white text-grey-dark" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-grey-dark">LinkedIn Profile / Portfolio</label>
                  <input type="url" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-orange focus:outline-none transition-colors bg-gray-50 focus:bg-white text-grey-dark" placeholder="https://linkedin.com/in/johndoe" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-grey-dark">Upload Resume (PDF)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-orange transition-colors cursor-pointer relative bg-gray-50 group">
                    <div className="space-y-2 text-center">
                      <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-orange" />
                      </div>
                      <div className="flex text-sm text-grey-dark justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-orange hover:text-orange-dark focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <p className="pl-1 text-grey-medium">or drag and drop</p>
                      </div>
                      <p className="text-xs text-grey-medium">PDF up to 5MB</p>
                      {file && <p className="text-sm font-bold text-green-600 mt-2 bg-green-50 py-2 px-4 rounded-lg inline-block border border-green-100">{file.name}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-grey-dark">Why should we select you?</label>
                  <textarea rows={4} required className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-orange focus:outline-none transition-colors bg-gray-50 focus:bg-white text-grey-dark" placeholder="Tell us about your passion and relevant experience..."></textarea>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-all shadow-sm hover:-translate-y-0.5 mt-8 text-lg disabled:opacity-70 disabled:hover:translate-y-0">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipApplication;
