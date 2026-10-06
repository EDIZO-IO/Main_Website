import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Clock, MapPin, DollarSign, ChevronDown, CheckCircle2,
  Copy, Check, ArrowLeft, ArrowRight, ShieldCheck, Zap,
  Bookmark, Star, ChevronUp, BookOpen, Users, Award, Briefcase,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Live countdown hook
const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = Math.max(0, targetDate - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hrs: Math.floor((diff % 86400000) / 3600000),
      min: Math.floor((diff % 3600000) / 60000),
      sec: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return time;
};

const TABS = ['Overview', 'Skills Required', 'Syllabus', 'Benefits', 'FAQs', 'Reviews'];

const InternshipDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const batchTarget = Date.now() + 7 * 24 * 3600000;
  const countdown = useCountdown(batchTarget);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const fetchAll = async () => {
      try {
        const [intRes, testimRes] = await Promise.all([
          fetch(`${API_URL}/api/internships/${id}`),
          fetch(`${API_URL}/api/testimonials?type=internship&id=${id}`).catch(() => null),
        ]);
        if (!intRes.ok) throw new Error('Not found');
        setData(await intRes.json());
        if (testimRes?.ok) setTestimonials(await testimRes.json());
      } catch (err) {
        console.error("Failed to fetch internship details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const safeArr = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') { try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch { return []; } }
    return [];
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: data?.title, url }); }
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    } catch { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-light dark:bg-[#060B13]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen bg-grey-light dark:bg-[#060B13]">
        <h1 className="text-4xl font-bold text-grey-dark dark:text-white mb-4">Internship not found</h1>
        <Link to="/internships" className="text-orange hover:underline font-bold">Return to Internships</Link>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const imageUrl = data.image && data.image !== '/images/internship.png'
    ? (data.image.startsWith('http') ? data.image : `${API_URL}${data.image}`)
    : null;

  const syllabus = safeArr(data.syllabus);
  const skills = safeArr(data.skills);
  const eligibility = safeArr(data.eligibility);
  const benefits = safeArr(data.benefits);
  const faqs = safeArr(data.faqs);
  const skillTags = safeArr(data.skill_tags || data.tags);

  // Benefits icon map for display
  const BENEFIT_ICONS = [<ShieldCheck size={20} />, <BookOpen size={20} />, <Zap size={20} />, <Star size={20} />, <Award size={20} />, <Users size={20} />];

  return (
    <div className="bg-[#F8F9FA] dark:bg-[#050B14] font-sans min-h-screen transition-colors duration-500">
      <Helmet>
        <title>{`${data.title} Internship Program | EDIZO`}</title>
        <meta name="description" content={data.short_description || data.description?.slice(0, 160) || "Gain industry experience with EDIZO internships."} />
        <link rel="canonical" href={`https://edizotech.in/internships/${id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://edizotech.in/internships/${id}`} />
        <meta property="og:title" content={`${data.title} Internship | EDIZO`} />
        <meta property="og:description" content={data.short_description || data.description?.slice(0, 160) || "Gain real world tech experience."} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
      </Helmet>

      {/* ======================================================
          HERO — dark, full-width with image
      ====================================================== */}
      <section className="relative bg-[#070F26] pt-36 pb-16 overflow-hidden border-b border-white/10">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-orange/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Background overlay image */}
        {imageUrl && (
          <>
            <img src={imageUrl} alt={data.title} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070F26]/95 via-[#070F26]/80 to-[#070F26]/50" />
          </>
        )}

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Back */}
          <Link to="/internships" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Internships
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left hero content */}
            <div>
              {/* Category badge */}
              {data.category && (
                <span className="inline-block px-4 py-1.5 rounded-full bg-orange/20 border border-orange/30 text-orange text-xs font-extrabold uppercase tracking-wider mb-5">
                  {data.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-3 leading-tight">
                <span className="text-white">{data.title?.split(' ').slice(0, -1).join(' ')} </span>
                <span className="text-orange">{data.title?.split(' ').slice(-1)[0]}</span>
              </h1>

              <p className="text-white/70 text-lg max-w-xl leading-relaxed mb-8">
                {data.short_description || data.description?.slice(0, 160)}
              </p>

              {/* 4 info chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: Clock, value: data.duration, label: 'Duration' },
                  { icon: MapPin, value: data.mode, label: 'Work Mode' },
                  { icon: DollarSign, value: data.stipend ? `₹${data.stipend}` : 'Certificate', label: data.stipend ? 'Stipend' : 'Benefit' },
                  { icon: Users, value: data.openings ? `${data.openings}` : null, label: 'Openings' },
                ].filter(c => c.value).map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                    <Icon size={16} className="text-orange" />
                    <div>
                      <p className="text-white font-bold text-sm leading-none">{value}</p>
                      <p className="text-white/50 text-[10px] mt-0.5">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skill tags */}
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
                      {typeof tag === 'string' ? tag : tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar — sticky in hero area */}
            <div className="bg-white dark:bg-[#0B132B] rounded-2xl shadow-2xl border border-grey-silver dark:border-white/10 overflow-hidden">
              {/* Status badge */}
              <div className="px-6 pt-5 pb-4 border-b border-grey-silver dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">Applications Open</span>
                </div>
                <button
                  onClick={handleShare}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${copied ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' : 'border-grey-silver dark:border-white/15 text-grey-medium dark:text-white/70 hover:text-orange hover:border-orange/30'}`}
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Share</>}
                </button>
              </div>

              <div className="p-6 space-y-3">
                {/* Apply button */}
                {isAuthenticated ? (
                  <Link
                    to={`/internships/${id}/apply`}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-all shadow-md shadow-orange/20 hover:-translate-y-0.5"
                  >
                    Apply Now <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0B132B] dark:bg-white text-white dark:text-[#0B132B] font-bold rounded-xl hover:opacity-90 transition-all"
                  >
                    Login to Apply <ArrowRight size={16} />
                  </Link>
                )}

                <button className="flex items-center justify-center gap-2 w-full py-3 border border-grey-silver dark:border-white/15 text-grey-dark dark:text-white font-bold rounded-xl hover:bg-grey-light dark:hover:bg-white/5 transition-colors text-sm">
                  <Bookmark size={15} /> Save for Later
                </button>

                {/* Countdown */}
                <div className="pt-3 border-t border-grey-silver dark:border-white/10">
                  <p className="text-xs font-bold text-grey-medium dark:text-white/60 uppercase tracking-wider mb-3">Next Batch Starts In</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { v: String(countdown.days).padStart(2, '0'), l: 'Days' },
                      { v: String(countdown.hrs).padStart(2, '0'), l: 'Hours' },
                      { v: String(countdown.min).padStart(2, '0'), l: 'Minutes' },
                      { v: String(countdown.sec).padStart(2, '0'), l: 'Seconds' },
                    ].map(({ v, l }) => (
                      <div key={l} className="text-center bg-grey-light dark:bg-[#060B13] rounded-xl py-2.5 border border-grey-silver dark:border-white/10">
                        <p className="text-xl font-extrabold text-grey-dark dark:text-white tabular-nums leading-none">{v}</p>
                        <p className="text-[8px] font-bold text-grey-medium dark:text-white/60 uppercase mt-1 leading-none">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits list from DB — only if exists */}
                {benefits.length > 0 && (
                  <div className="pt-3 border-t border-grey-silver dark:border-white/10 space-y-3">
                    {benefits.slice(0, 4).map((b, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          i === 0 ? 'bg-blue-50 dark:bg-blue-950 text-blue-500' : i === 1 ? 'bg-green-50 dark:bg-green-950 text-green-500' : i === 2 ? 'bg-orange/10 text-orange' : 'bg-purple-50 dark:bg-purple-950 text-purple-500'
                        }`}>
                          {BENEFIT_ICONS[i] || <CheckCircle2 size={16} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-grey-dark dark:text-white">{typeof b === 'string' ? b : b.title}</p>
                          {typeof b === 'object' && b.desc && <p className="text-xs text-grey-medium dark:text-white/60">{b.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          TAB BAR
      ====================================================== */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#0B132B] border-b border-grey-silver dark:border-white/10 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {TABS.filter(t => {
              if (t === 'Skills Required') return skills.length > 0;
              if (t === 'Syllabus') return syllabus.length > 0;
              if (t === 'Benefits') return benefits.length > 0;
              if (t === 'FAQs') return faqs.length > 0;
              if (t === 'Reviews') return testimonials.length > 0;
              return true;
            }).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab
                    ? 'text-orange border-orange'
                    : 'text-grey-medium dark:text-white/60 border-transparent hover:text-grey-dark dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN CONTENT — 3 columns on desktop
      ====================================================== */}
      <section className="py-12 bg-grey-light dark:bg-[#050B14] transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-7xl">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >

              {/* OVERVIEW TAB */}
              {activeTab === 'Overview' && (
                <div className="grid lg:grid-cols-3 gap-8">

                  {/* Left: About + Quote + Feature icons */}
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-7 border border-grey-silver dark:border-white/10 shadow-sm">
                      <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-4">About This Internship</h2>
                      <div className="text-grey-medium dark:text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                        {data.description}
                      </div>
                    </div>

                    {/* Quote — only if in data */}
                    {data.quote && (
                      <div className="bg-orange/5 border border-orange/20 rounded-2xl p-6">
                        <div className="text-3xl text-orange font-serif leading-none mb-2">"</div>
                        <p className="text-grey-dark dark:text-white font-semibold leading-relaxed text-sm italic">{data.quote}</p>
                        <p className="text-orange font-bold text-xs mt-3">— EDIZO Team</p>
                      </div>
                    )}

                    {/* 4 feature highlights */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Hands-on\nLive Projects', icon: <Briefcase className="text-orange" size={20} /> },
                        { label: 'Expert\nMentorship', icon: <Users className="text-blue-500" size={20} /> },
                        { label: 'Industry\nCertificate', icon: <Award className="text-purple-500" size={20} /> },
                        { label: 'Placement\nAssistance', icon: <Zap className="text-green-500" size={20} /> },
                      ].map(({ label, icon }) => (
                        <div key={label} className="bg-white dark:bg-[#0B132B] rounded-xl p-4 border border-grey-silver dark:border-white/10 text-center shadow-sm">
                          <div className="w-10 h-10 rounded-xl bg-grey-light dark:bg-[#060B13] flex items-center justify-center mx-auto mb-2">{icon}</div>
                          <p className="text-xs font-bold text-grey-dark dark:text-white whitespace-pre-line leading-tight">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Center: Skills + Who Can Apply */}
                  <div className="space-y-6">
                    {/* Skills You'll Gain */}
                    {skills.length > 0 && (
                      <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-7 border border-grey-silver dark:border-white/10 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                          <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white">Skills You'll Gain</h2>
                        </div>
                        <div className="space-y-3">
                          {skills.map((skill, i) => (
                            <div key={i} className="flex items-start gap-3 group">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                i % 4 === 0 ? 'bg-blue-50 dark:bg-blue-950 text-blue-500' :
                                i % 4 === 1 ? 'bg-orange/10 text-orange' :
                                i % 4 === 2 ? 'bg-green-50 dark:bg-green-950 text-green-500' : 'bg-purple-50 dark:bg-purple-950 text-purple-500'
                              }`}>
                                <BookOpen size={16} />
                              </div>
                              <div>
                                <p className="font-bold text-grey-dark dark:text-white text-sm">{typeof skill === 'string' ? skill : skill.name}</p>
                                {typeof skill === 'object' && skill.desc && <p className="text-xs text-grey-medium dark:text-white/60">{skill.desc}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Who Can Apply */}
                    {eligibility.length > 0 && (
                      <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-7 border border-grey-silver dark:border-white/10 shadow-sm">
                        <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-5">Who Can Apply?</h2>
                        <ul className="space-y-3">
                          {eligibility.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-grey-dark dark:text-white/80">
                              <CheckCircle2 size={16} className="text-orange shrink-0 mt-0.5" />
                              {typeof item === 'string' ? item : item.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right: Syllabus + FAQs */}
                  <div className="space-y-6">
                    {/* Syllabus */}
                    {syllabus.length > 0 && (
                      <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-7 border border-grey-silver dark:border-white/10 shadow-sm">
                        <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-5">Syllabus</h2>
                        <ol className="space-y-3">
                          {syllabus.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-orange/10 text-orange text-xs font-extrabold flex items-center justify-center shrink-0">{i + 1}</span>
                              <span className="text-sm text-grey-dark dark:text-white/80 font-medium">{typeof item === 'string' ? item : item.topic}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* FAQs */}
                    {faqs.length > 0 && (
                      <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-7 border border-grey-silver dark:border-white/10 shadow-sm">
                        <h2 className="text-xl font-display font-bold text-grey-dark dark:text-white mb-5">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                          {faqs.map((faq, i) => (
                            <div key={i} className="border border-grey-silver dark:border-white/10 rounded-xl overflow-hidden">
                              <button
                                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-grey-light dark:hover:bg-white/5 transition-colors"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                              >
                                <span className="text-sm font-bold text-grey-dark dark:text-white">{typeof faq === 'string' ? faq : faq.question}</span>
                                {openFaq === i ? <ChevronUp size={16} className="text-orange shrink-0" /> : <ChevronDown size={16} className="text-grey-medium dark:text-white/60 shrink-0" />}
                              </button>
                              {openFaq === i && typeof faq === 'object' && faq.answer && (
                                <div className="px-5 pb-4 text-sm text-grey-medium dark:text-white/70 leading-relaxed border-t border-grey-silver dark:border-white/10 bg-grey-light dark:bg-[#060B13]">
                                  <p className="pt-3">{faq.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === 'Skills Required' && skills.length > 0 && (
                <div className="max-w-2xl">
                  <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-8 border border-grey-silver dark:border-white/10 shadow-sm">
                    <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-6">Skills You'll Gain</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {skills.map((skill, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-grey-silver dark:border-white/10 hover:border-orange/30 hover:bg-orange/5 transition-all">
                          <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0"><BookOpen size={15} /></div>
                          <div>
                            <p className="font-bold text-grey-dark dark:text-white text-sm">{typeof skill === 'string' ? skill : skill.name}</p>
                            {typeof skill === 'object' && skill.desc && <p className="text-xs text-grey-medium dark:text-white/60">{skill.desc}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SYLLABUS TAB */}
              {activeTab === 'Syllabus' && syllabus.length > 0 && (
                <div className="max-w-2xl">
                  <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-8 border border-grey-silver dark:border-white/10 shadow-sm">
                    <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-6">Program Syllabus</h2>
                    <ol className="space-y-4">
                      {syllabus.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 p-4 rounded-xl border border-grey-silver dark:border-white/10 hover:border-orange/20 transition-all">
                          <span className="w-8 h-8 rounded-full bg-orange text-white text-sm font-extrabold flex items-center justify-center shrink-0 shadow-sm">{i + 1}</span>
                          <span className="font-medium text-grey-dark dark:text-white">{typeof item === 'string' ? item : item.topic}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* BENEFITS TAB */}
              {activeTab === 'Benefits' && benefits.length > 0 && (
                <div className="max-w-2xl">
                  <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-8 border border-grey-silver dark:border-white/10 shadow-sm">
                    <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-6">Program Benefits</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-grey-silver dark:border-white/10">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            i % 3 === 0 ? 'bg-blue-50 dark:bg-blue-950 text-blue-500' : i % 3 === 1 ? 'bg-orange/10 text-orange' : 'bg-green-50 dark:bg-green-950 text-green-500'
                          }`}>
                            {BENEFIT_ICONS[i % 6] || <CheckCircle2 size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-grey-dark dark:text-white text-sm">{typeof b === 'string' ? b : b.title}</p>
                            {typeof b === 'object' && b.desc && <p className="text-xs text-grey-medium dark:text-white/60 mt-0.5">{b.desc}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FAQS TAB */}
              {activeTab === 'FAQs' && faqs.length > 0 && (
                <div className="max-w-2xl">
                  <div className="bg-white dark:bg-[#0B132B] rounded-2xl p-8 border border-grey-silver dark:border-white/10 shadow-sm">
                    <h2 className="text-2xl font-display font-bold text-grey-dark dark:text-white mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {faqs.map((faq, i) => (
                        <div key={i} className="border border-grey-silver dark:border-white/10 rounded-xl overflow-hidden">
                          <button
                            className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left hover:bg-grey-light dark:hover:bg-white/5 transition-colors"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          >
                            <span className="font-bold text-grey-dark dark:text-white">{typeof faq === 'string' ? faq : faq.question}</span>
                            {openFaq === i ? <ChevronUp size={18} className="text-orange shrink-0" /> : <ChevronDown size={18} className="text-grey-medium dark:text-white/60 shrink-0" />}
                          </button>
                          {openFaq === i && typeof faq === 'object' && faq.answer && (
                            <div className="px-6 pb-5 text-grey-medium dark:text-white/70 text-sm leading-relaxed border-t border-grey-silver dark:border-white/10 bg-grey-light dark:bg-[#060B13]">
                              <p className="pt-4">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'Reviews' && testimonials.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
                  {testimonials.map((t, i) => (
                    <div key={i} className="bg-white dark:bg-[#0B132B] rounded-2xl p-6 border border-grey-silver dark:border-white/10 shadow-sm">
                      <div className="flex gap-0.5 mb-4">
                        {[...Array(t.rating || 5)].map((_, ri) => (
                          <Star key={ri} size={14} fill="currentColor" className="text-orange" />
                        ))}
                      </div>
                      <p className="text-grey-dark dark:text-white/90 text-sm leading-relaxed italic mb-5">"{t.content || t.text || t.quote}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange/10 flex items-center justify-center text-orange font-bold text-sm shrink-0">
                          {(t.author || t.name)?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-grey-dark dark:text-white text-sm">{t.author || t.name}</p>
                          <p className="text-xs text-grey-medium dark:text-white/60">{t.role || t.program}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ======================================================
          BOTTOM CTA
      ====================================================== */}
      <section className="py-14 bg-[#070F26] relative overflow-hidden border-t border-white/10">
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute left-0 top-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-orange font-bold text-xs uppercase tracking-widest mb-2">Ready to Start?</p>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white leading-tight">
                Take the First Step Towards Your{' '}
                <span className="text-orange">Dream Career</span>
              </h2>
              <p className="text-white/60 mt-2 text-sm">Join hundreds of students who are building their future with EDIZO.</p>
            </div>
            <div className="flex gap-4 flex-wrap shrink-0">
              {isAuthenticated ? (
                <Link to={`/internships/${id}/apply`} className="px-7 py-3.5 bg-orange text-white font-bold rounded-full hover:bg-orange-dark transition-all inline-flex items-center gap-2 shadow-lg shadow-orange/30 hover:-translate-y-0.5">
                  Apply Now <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/login" className="px-7 py-3.5 bg-orange text-white font-bold rounded-full hover:bg-orange-dark transition-all inline-flex items-center gap-2 shadow-lg shadow-orange/30 hover:-translate-y-0.5">
                  Apply Now <ArrowRight size={16} />
                </Link>
              )}
              <Link to="/internships" className="px-7 py-3.5 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:-translate-y-0.5">
                Explore More Internships
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default InternshipDetails;
