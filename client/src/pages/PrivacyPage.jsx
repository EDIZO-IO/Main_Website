import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="bg-[#F8F9FA] dark:bg-[#050B14] font-sans min-h-screen pt-32 pb-24 text-grey-dark dark:text-white transition-colors duration-500">
      <Helmet>
        <title>Privacy Policy - EDIZO</title>
        <meta name="description" content="Learn how EDIZO collects, uses, protects, and handles your personal data, privacy, and sensitive information." />
        <link rel="canonical" href="https://edizotech.in/privacy" />
      </Helmet>

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-grey-silver dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 text-orange text-xs font-extrabold uppercase tracking-widest mb-4">
            <Lock size={14} /> Data Protection & Privacy
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4 text-grey-dark dark:text-white">Privacy Policy</h1>
          <p className="text-grey-medium dark:text-white/60 text-sm">Last updated: September 2026</p>
        </motion.div>

        <div className="space-y-10 text-grey-medium dark:text-white/80 leading-relaxed text-base">
          <section className="bg-white dark:bg-[#0B132B] p-6 md:p-8 rounded-3xl border border-grey-silver dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-3">Overview</h2>
            <p>
              At EDIZO ("Company", "we", "our"), protecting your privacy and safeguarding your personal information is a top priority. This Privacy Policy explains what data we collect when you visit <span className="text-orange font-semibold">edizotech.in</span>, how we process it, and your data rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">1. Information We Collect</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-grey-silver dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2 text-orange font-bold text-sm mb-2">
                  <Eye size={16} /> Personal Information
                </div>
                <p className="text-sm">Name, email address, phone number, organization, and project details provided when submitting contact forms or applying for internships.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B132B] border border-grey-silver dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-2 text-orange font-bold text-sm mb-2">
                  <Database size={16} /> Technical & Usage Data
                </div>
                <p className="text-sm">IP address, browser type, device information, operating system, and anonymous analytics to improve site usability and security.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 text-grey-medium dark:text-white/70">
              <li>To provide client proposals, technical consultations, and software development services.</li>
              <li>To process and evaluate student internship applications and certifications.</li>
              <li>To maintain website security, prevent malicious brute-force attempts, and protect system integrity.</li>
              <li>To send updates and service responses requested directly by you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">3. Data Security & Storage</h2>
            <p>
              We enforce strict industry-standard security protocols, including TLS/HTTPS encryption across all data in transit, salted bcrypt password hashing, parameterized SQL operations, and role-based access control. We never sell, rent, or trade your personal data to third parties.
            </p>
          </section>

          <section className="border-t border-grey-silver dark:border-white/10 pt-8">
            <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-3">4. Contact Privacy Officer</h2>
            <p className="mb-4">If you have questions regarding your data or wish to request data erasure, reach out to:</p>
            <div className="bg-white dark:bg-[#0B132B] p-6 rounded-2xl border border-grey-silver dark:border-white/10 shadow-sm">
              <p className="font-bold text-grey-dark dark:text-white">EDIZO Privacy & Data Governance</p>
              <p className="text-sm text-grey-medium dark:text-white/60">Email: <a href="mailto:edizooffical@gmail.com" className="text-orange font-semibold hover:underline">edizooffical@gmail.com</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
