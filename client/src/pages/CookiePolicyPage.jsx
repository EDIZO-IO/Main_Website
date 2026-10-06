import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Cookie, CheckCircle2, Sliders, Shield } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="bg-[#F8F9FA] dark:bg-[#050B14] font-sans min-h-screen pt-32 pb-24 text-grey-dark dark:text-white transition-colors duration-300">
      <Helmet>
        <title>Cookie Policy - EDIZO</title>
        <meta name="description" content="Understand how EDIZO uses cookies and local storage technologies to enhance your browsing experience." />
        <link rel="canonical" href="https://edizotech.in/cookies" />
      </Helmet>

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-grey-silver/40 dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 text-orange text-xs font-extrabold uppercase tracking-widest mb-4">
            <Cookie size={14} /> Cookie & Storage Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4 text-grey-dark dark:text-white">Cookie Policy</h1>
          <p className="text-grey-dark/60 dark:text-white/60 text-sm">Last updated: September 2026</p>
        </motion.div>

        <div className="space-y-10 text-grey-dark/80 dark:text-white/80 leading-relaxed text-base">
          <section className="bg-white dark:bg-[#0B132B] p-6 md:p-8 rounded-3xl border border-grey-silver/40 dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-3">What Are Cookies?</h2>
            <p>
              Cookies and web storage (such as LocalStorage and SessionStorage) are small data files placed on your device to remember user preferences, maintain session state, and deliver an optimized experience when visiting <span className="text-orange font-semibold">edizotech.in</span>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">Categories of Cookies We Use</h2>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-grey-silver/40 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 font-bold text-lg text-grey-dark dark:text-white mb-2">
                  <Shield size={20} className="text-orange" /> Essential & Preference Storage
                </div>
                <p className="text-sm text-grey-dark/70 dark:text-white/70">
                  Required for core site features such as theme preference (Dark Mode / Light Mode), authenticated session tokens, and security validation. These cannot be disabled.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B132B] border border-grey-silver/40 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-3 font-bold text-lg text-grey-dark dark:text-white mb-2">
                  <Sliders size={20} className="text-orange" /> Performance & Analytics
                </div>
                <p className="text-sm text-grey-dark/70 dark:text-white/70">
                  Anonymous performance metrics that allow us to detect broken routes, measure page load speeds, and optimize user flows across different screen sizes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">How to Manage Cookies</h2>
            <p className="mb-4">
              You can control and manage cookie settings directly in your browser. Most browsers allow you to block or delete cookies in their privacy settings:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-grey-dark/70 dark:text-white/70">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Third-party cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Block all cookies</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            </ul>
          </section>

          <section className="border-t border-grey-silver/40 dark:border-white/10 pt-8">
            <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-3">Contact Us</h2>
            <p className="mb-4">If you have any questions about our use of cookies, contact us at <a href="mailto:edizooffical@gmail.com" className="text-orange font-semibold hover:underline">edizooffical@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
