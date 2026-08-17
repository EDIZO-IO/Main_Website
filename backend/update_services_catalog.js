require('dotenv').config();
const mysql = require('mysql2/promise');

const newServices = [
  {
    title: "Web Development",
    category: "Development",
    description: "We build scalable, high-performance web applications tailored for real business operations, from SaaS platforms to complex customer portals.",
    features: JSON.stringify([
      "Custom Architecture Design",
      "API & Third-Party Integrations",
      "Authentication & Role Management",
      "Cloud Deployment & Hosting"
    ]),
    solutions: JSON.stringify([
      { title: "Business Websites", description: "Professional websites designed for visibility and conversion." },
      { title: "SaaS Applications", description: "Scalable subscription-based software and multitenant systems." },
      { title: "E-commerce Platforms", description: "Online stores with integrated payments, orders, and inventory." },
      { title: "Admin Dashboards", description: "Centralized management panels with data analytics." },
      { title: "Customer Portals", description: "Secure interfaces for your customers to manage their data." },
      { title: "Landing Pages", description: "High-converting single pages optimized for marketing campaigns." }
    ]),
    technologies: JSON.stringify([
      { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Express", "Python"] },
      { category: "Database", items: ["MySQL", "MongoDB", "PostgreSQL"] },
      { category: "Infrastructure", items: ["AWS", "Docker", "Cloudflare"] }
    ]),
    process: JSON.stringify([
      { title: "Discover", description: "Understand your business, users and requirements." },
      { title: "Plan", description: "Define features, architecture and project roadmap." },
      { title: "Design", description: "Create UI/UX and validate the experience." },
      { title: "Develop", description: "Build, integrate and test the application." },
      { title: "Launch", description: "Deploy, monitor and optimize for production." },
      { title: "Support", description: "Provide maintenance and continuous improvements." }
    ]),
    benefits: JSON.stringify([
      { title: "Built Around Your Business", description: "We don't force your requirements into an existing template." },
      { title: "Modern Technology", description: "We use current frameworks and scalable architectures." },
      { title: "End-to-End Development", description: "From requirements and UI/UX to deployment and maintenance." },
      { title: "Long-Term Support", description: "We continue improving your platform long after launch." }
    ]),
    faqs: JSON.stringify([
      { question: "How long does a website take to develop?", answer: "A standard business website takes 2-4 weeks, while custom web applications can take 2-4 months depending on complexity." },
      { question: "Do you build custom websites?", answer: "Yes, all our web applications are custom-built to match your exact business logic and branding." },
      { question: "Can you integrate payment gateways?", answer: "Absolutely. We integrate Stripe, Razorpay, PayPal, and custom banking APIs seamlessly." },
      { question: "Do you provide hosting and deployment?", answer: "Yes, we handle end-to-end deployment on AWS, Vercel, DigitalOcean, or your preferred cloud provider." },
      { question: "Can you maintain an existing application?", answer: "We can take over existing codebases after a thorough technical audit to ensure stability." }
    ]),
    price: null,
    icon: "Globe",
    image_url: "/images/services/web dev.png"
  },
  {
    title: "App Development",
    category: "Development",
    description: "Native and cross-platform mobile applications designed for exceptional user experience and high performance across all devices.",
    features: JSON.stringify([
      "Cross-Platform Compatibility",
      "Offline Mode Support",
      "Push Notifications",
      "Native Device Features"
    ]),
    solutions: JSON.stringify([
      { title: "Android Applications", description: "Native performance tailored for the Android ecosystem." },
      { title: "iOS Applications", description: "Premium applications designed for Apple devices." },
      { title: "Cross-Platform Apps", description: "Write once, run anywhere with Flutter or React Native." },
      { title: "Enterprise Mobility", description: "Internal apps to streamline your workforce operations." }
    ]),
    technologies: JSON.stringify([
      { category: "Frameworks", items: ["Flutter", "React Native"] },
      { category: "Languages", items: ["Dart", "Kotlin", "Swift"] },
      { category: "Backend/BaaS", items: ["Firebase", "Supabase", "Node.js API"] }
    ]),
    process: JSON.stringify([
      { title: "Discover", description: "Analyze the app market, user needs, and platform constraints." },
      { title: "Design", description: "Create mobile-first UI/UX and interactive prototypes." },
      { title: "Develop", description: "Code the app and integrate with backend APIs." },
      { title: "Test", description: "Rigorous testing across multiple devices and OS versions." },
      { title: "Publish", description: "Submit to Google Play Store and Apple App Store." }
    ]),
    benefits: JSON.stringify([
      { title: "Native Feel", description: "Smooth animations and native-like performance." },
      { title: "App Store Optimization", description: "Guidance on store listings to maximize downloads." },
      { title: "Secure Data", description: "Encrypted storage and secure API communication." }
    ]),
    faqs: JSON.stringify([
      { question: "Do you build for iOS and Android?", answer: "Yes, we use frameworks like Flutter to build for both platforms simultaneously." },
      { question: "Will you help upload the app to the store?", answer: "Yes, we handle the entire submission process for both Google Play and the App Store." }
    ]),
    price: null,
    icon: "Smartphone",
    image_url: "/images/services/App development.png"
  },
  {
    title: "Graphic Design",
    category: "Design Services",
    description: "Creative digital design services to help you establish a strong, memorable brand identity and communicate your value visually.",
    features: JSON.stringify([
      "Custom Illustrations",
      "Print-Ready Formats",
      "Brand Guidelines",
      "Vector Graphics"
    ]),
    solutions: JSON.stringify([
      { title: "Logo Design", description: "Unique and memorable logos that represent your brand." },
      { title: "Brand Identity", description: "Complete visual systems including typography and color palettes." },
      { title: "Social Media Posters", description: "Engaging graphics optimized for Instagram, LinkedIn, etc." },
      { title: "UI/UX Design", description: "User-centric interfaces for websites and applications." },
      { title: "Presentation (PPT)", description: "Professional pitch decks and corporate presentations." },
      { title: "Banner & Flyer Design", description: "High-impact designs for digital and print marketing." }
    ]),
    technologies: JSON.stringify([
      { category: "UI/UX", items: ["Figma", "Adobe XD"] },
      { category: "Vector & Print", items: ["Adobe Illustrator", "CorelDRAW"] },
      { category: "Photo Editing", items: ["Adobe Photoshop", "Lightroom"] }
    ]),
    process: JSON.stringify([
      { title: "Brief", description: "Understand your brand values and visual preferences." },
      { title: "Concept", description: "Develop initial sketches and mood boards." },
      { title: "Design", description: "Create digital versions of the selected concepts." },
      { title: "Refine", description: "Iterate based on your feedback." },
      { title: "Deliver", description: "Provide final assets in all required formats." }
    ]),
    benefits: JSON.stringify([
      { title: "Original Artwork", description: "We don't rely on generic stock templates." },
      { title: "Strategic Design", description: "Visuals designed specifically for your target audience." },
      { title: "Versatile Formats", description: "Assets ready for both digital screens and physical print." }
    ]),
    faqs: JSON.stringify([
      { question: "Do I get the source files?", answer: "Yes, we provide all original source files (Figma, AI, PSD) upon project completion." },
      { question: "How many revisions do you offer?", answer: "We typically include 2-3 rounds of revisions to ensure you're completely satisfied." }
    ]),
    price: null,
    icon: "Palette",
    image_url: "/images/services/graphic design.png"
  },
  {
    title: "Video Editing",
    category: "Media",
    description: "Professional video production and editing to create engaging, high-retention content for your audience across all platforms.",
    features: JSON.stringify([
      "Color Correction & Grading",
      "Audio Mixing & Mastering",
      "Subtitles & Captions",
      "Transition Effects"
    ]),
    solutions: JSON.stringify([
      { title: "Reels & Shorts", description: "High-paced, vertical formats for TikTok and Instagram." },
      { title: "YouTube Editing", description: "Long-form content optimized for audience retention." },
      { title: "Motion Graphics", description: "Animated text and graphics to explain complex concepts." },
      { title: "Promotional Videos", description: "High-quality brand videos and product commercials." }
    ]),
    technologies: JSON.stringify([
      { category: "Editing", items: ["Adobe Premiere Pro", "DaVinci Resolve", "Final Cut Pro"] },
      { category: "VFX & Animation", items: ["Adobe After Effects", "Blender"] },
      { category: "Audio", items: ["Adobe Audition", "Logic Pro"] }
    ]),
    process: JSON.stringify([
      { title: "Review", description: "Analyze your raw footage and project goals." },
      { title: "Assembly", description: "Create the initial rough cut to establish pacing." },
      { title: "Enhance", description: "Add color grading, transitions, and motion graphics." },
      { title: "Audio", description: "Mix sound, add music, and normalize dialogue." },
      { title: "Export", description: "Render in optimal formats for your target platforms." }
    ]),
    benefits: JSON.stringify([
      { title: "Retention Focused", description: "Edited specifically to maximize viewer watch time." },
      { title: "Platform Optimized", description: "Correct aspect ratios and pacing for different social networks." },
      { title: "Quick Turnaround", description: "Efficient workflows to meet your content schedule." }
    ]),
    faqs: JSON.stringify([
      { question: "Can you edit vertical videos for Instagram Reels?", answer: "Yes, we specialize in high-retention vertical formats with dynamic captions." },
      { question: "Do you provide stock footage or music?", answer: "Yes, we have access to extensive libraries of licensed music and high-quality stock footage." }
    ]),
    price: null,
    icon: "Film",
    image_url: "/images/services/video editing.png"
  },
  {
    title: "SEO & Digital Marketing",
    category: "Marketing",
    description: "Data-driven marketing strategies to increase your search visibility, drive targeted traffic, and accelerate business growth.",
    features: JSON.stringify([
      "Keyword Research",
      "Competitor Analysis",
      "Performance Tracking",
      "A/B Testing"
    ]),
    solutions: JSON.stringify([
      { title: "SEO", description: "On-page and off-page optimization to rank higher on Google." },
      { title: "Social Media Marketing", description: "Strategic campaigns across LinkedIn, Instagram, and X." },
      { title: "Google Ads", description: "High-ROI PPC campaigns to capture active intent." },
      { title: "Content Marketing", description: "Valuable blogs and articles to build authority." }
    ]),
    technologies: JSON.stringify([
      { category: "Analytics", items: ["Google Analytics 4", "Search Console"] },
      { category: "SEO Tools", items: ["Ahrefs", "SEMrush", "Screaming Frog"] },
      { category: "Advertising", items: ["Google Ads Manager", "Meta Business Suite"] }
    ]),
    process: JSON.stringify([
      { title: "Audit", description: "Analyze your current digital presence and competitors." },
      { title: "Strategy", description: "Develop a customized marketing roadmap and KPIs." },
      { title: "Execute", description: "Implement SEO changes and launch ad campaigns." },
      { title: "Monitor", description: "Track performance daily and adjust bids/targeting." },
      { title: "Report", description: "Provide transparent, monthly analytics reports." }
    ]),
    benefits: JSON.stringify([
      { title: "Data-Driven", description: "Decisions based on hard metrics, not guesswork." },
      { title: "ROI Focused", description: "We optimize for conversions and revenue, not just clicks." },
      { title: "White-Hat Methods", description: "Sustainable SEO techniques that survive algorithm updates." }
    ]),
    faqs: JSON.stringify([
      { question: "How long does SEO take to show results?", answer: "SEO is a long-term strategy. You typically start seeing meaningful organic growth within 3 to 6 months." },
      { question: "Do you guarantee first-page rankings?", answer: "No reputable agency can guarantee #1 rankings due to Google's dynamic algorithm, but we consistently achieve first-page results for our clients." }
    ]),
    price: null,
    icon: "TrendingUp",
    image_url: "/images/services/seo marketing.png"
  },
  {
    title: "API Solutions",
    category: "Tech Solutions",
    description: "Robust API development and integration services to connect your systems, automate workflows, and streamline operations.",
    features: JSON.stringify([
      "RESTful & GraphQL APIs",
      "Rate Limiting & Security",
      "Webhooks Implementation",
      "Comprehensive Documentation"
    ]),
    solutions: JSON.stringify([
      { title: "Custom API Development", description: "Secure, scalable endpoints for your applications." },
      { title: "Third-Party Integration", description: "Connecting your app with Stripe, Twilio, Salesforce, etc." },
      { title: "Automation Solutions", description: "Scripts and workflows to eliminate manual data entry." },
      { title: "Database Management", description: "Schema design, optimization, and migration." }
    ]),
    technologies: JSON.stringify([
      { category: "API Frameworks", items: ["Express.js", "FastAPI", "Apollo GraphQL"] },
      { category: "Documentation", items: ["Swagger", "Postman", "OpenAPI"] },
      { category: "Security", items: ["JWT", "OAuth 2.0", "API Gateways"] }
    ]),
    process: JSON.stringify([
      { title: "Architecture", description: "Design the API schema, endpoints, and data flow." },
      { title: "Develop", description: "Write clean, performant controller logic." },
      { title: "Secure", description: "Implement authentication and rate limiting." },
      { title: "Document", description: "Generate interactive developer documentation." },
      { title: "Test", description: "Automate endpoint testing for reliability." }
    ]),
    benefits: JSON.stringify([
      { title: "Scalable Architecture", description: "Built to handle thousands of requests per second." },
      { title: "Developer Friendly", description: "Clear documentation making it easy for other teams to consume." },
      { title: "High Security", description: "Following OWASP standards to prevent data breaches." }
    ]),
    faqs: JSON.stringify([
      { question: "Can you integrate with legacy systems?", answer: "Yes, we often build middleware APIs to modernize and connect older legacy systems with modern web apps." },
      { question: "Do you build REST or GraphQL APIs?", answer: "We build both, depending on your data querying needs and frontend requirements." }
    ]),
    price: null,
    icon: "Code",
    image_url: "/images/services/our services.png"
  },
  {
    title: "Internships & Workshops",
    category: "Learning & Training",
    description: "Empowering the next generation of developers with hands-on technical training, real-world projects, and industry insights.",
    features: JSON.stringify([
      "Live Coding Sessions",
      "Industry Mentorship",
      "Certificate of Completion",
      "Career Guidance"
    ]),
    solutions: JSON.stringify([
      { title: "Internships", description: "Months-long programs working on real production codebases." },
      { title: "Workshops", description: "Intensive 1-3 day deep dives into specific technologies." },
      { title: "Final Year Projects", description: "Guidance and architecture planning for academic projects." },
      { title: "Technical Training", description: "Corporate training to upskill existing teams." }
    ]),
    technologies: JSON.stringify([
      { category: "Curriculum", items: ["Full-Stack Web", "Mobile Dev", "Cloud Architecture"] },
      { category: "Tools", items: ["Git/GitHub", "VS Code", "Agile Methodologies"] }
    ]),
    process: JSON.stringify([
      { title: "Assess", description: "Evaluate the student's or team's current skill level." },
      { title: "Curriculum", description: "Design a tailored learning path." },
      { title: "Theory", description: "Teach the core concepts and best practices." },
      { title: "Practice", description: "Hands-on implementation of the concepts." },
      { title: "Review", description: "Code reviews and constructive feedback." }
    ]),
    benefits: JSON.stringify([
      { title: "Real-World Experience", description: "Learn how software is built in a real company, not just tutorials." },
      { title: "Expert Mentors", description: "Taught by senior developers currently working in the industry." },
      { title: "Portfolio Building", description: "Graduate with actual projects to show future employers." }
    ]),
    faqs: JSON.stringify([
      { question: "Are the internships paid or unpaid?", answer: "We offer both stipended internships for advanced candidates and unpaid learning internships for beginners." },
      { question: "Do you offer placement assistance?", answer: "Top performing interns are often absorbed into our full-time team or referred to our partner network." }
    ]),
    price: null,
    icon: "GraduationCap",
    image_url: "/images/services/internship.png"
  }
];

async function updateServicesCatalog() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'edizo_db'
  });

  try {
    console.log("Emptying current services table...");
    await db.execute('TRUNCATE TABLE services');
    
    console.log("Inserting enriched services catalog...");
    for (const service of newServices) {
      await db.execute(`
        INSERT INTO services 
        (title, category, description, features, solutions, technologies, process, benefits, faqs, price, icon, image_url, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `, [
        service.title, 
        service.category, 
        service.description, 
        service.features, 
        service.solutions,
        service.technologies,
        service.process,
        service.benefits,
        service.faqs,
        service.price, 
        service.icon, 
        service.image_url
      ]);
      console.log(`Inserted: ${service.title}`);
    }

    console.log("✅ Enriched services catalog updated successfully!");
  } catch (error) {
    console.error("Error updating services catalog:", error);
  } finally {
    await db.end();
  }
}

updateServicesCatalog();
