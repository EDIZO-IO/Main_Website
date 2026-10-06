import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="bg-[#F8F9FA] dark:bg-[#050B14] font-sans min-h-screen pt-32 pb-24 text-grey-dark dark:text-white transition-colors duration-500">
      <Helmet>
        <title>Terms & Conditions - EDIZO</title>
        <meta name="description" content="Read the terms and conditions governing the use of EDIZO websites, services, products, and internship programs." />
        <link rel="canonical" href="https://edizotech.in/terms" />
      </Helmet>

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 border-b border-grey-silver dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 text-orange text-xs font-extrabold uppercase tracking-widest mb-4">
            <FileText size={14} /> Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-4 text-grey-dark dark:text-white">Terms & Conditions</h1>
          <p className="text-grey-medium dark:text-white/60 text-sm">Last updated: September 2026</p>
        </motion.div>

        <div className="space-y-10 text-grey-medium dark:text-white/80 leading-relaxed text-base">
          <section className="bg-white dark:bg-[#0B132B] p-6 md:p-8 rounded-3xl border border-grey-silver dark:border-white/10 shadow-sm">
            <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing, browsing, or using our website (<span className="text-orange font-semibold">edizotech.in</span>), digital products, or software services provided by EDIZO ("Company", "we", "our", or "us"), you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, please discontinue use immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">2. Services & Engagements</h2>
            <p className="mb-4">
              EDIZO provides software design, custom web and mobile development, SaaS architecture, UI/UX engineering, and student/professional technical internship programs.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-orange shrink-0 mt-1" />
                <span>All client project deliverables, timelines, milestones, and payment terms are formally defined in individual service proposals and contracts.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-orange shrink-0 mt-1" />
                <span>Internship programs provide experiential learning, mentorship, and project-based training subject to the codes of conduct outlined upon enrollment.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">3. Intellectual Property</h2>
            <p>
              All proprietary code, branding, logos, graphics, and website materials produced by EDIZO remain our intellectual property until full transfer upon final client settlement as stipulated in individual agreements. Unapproved reproduction or distribution of EDIZO intellectual property is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">4. User Accounts & Security</h2>
            <p>
              When creating an account on our platform or applying for internships, you are responsible for maintaining confidentiality of your credentials. You agree to notify us immediately of any unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall EDIZO, its founders, directors, or employees be liable for any indirect, incidental, consequential, or punitive damages resulting from the use or inability to use our website or services.
            </p>
          </section>

          <section className="border-t border-grey-silver dark:border-white/10 pt-8">
            <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-3">6. Contact & Questions</h2>
            <p className="mb-4">For any inquiries regarding our Terms & Conditions, please contact us at:</p>
            <div className="bg-white dark:bg-[#0B132B] p-6 rounded-2xl border border-grey-silver dark:border-white/10 shadow-sm">
              <p className="font-bold text-grey-dark dark:text-white">EDIZO Legal & Compliance</p>
              <p className="text-sm text-grey-medium dark:text-white/60">Email: <a href="mailto:edizooffical@gmail.com" className="text-orange font-semibold hover:underline">edizooffical@gmail.com</a></p>
              <p className="text-sm text-grey-medium dark:text-white/60">Phone: +91 7092435729</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
