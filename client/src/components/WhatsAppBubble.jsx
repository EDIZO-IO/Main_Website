import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const WhatsAppBubble = () => {
  const { settings, loading } = useSite();

  if (loading || !settings?.phone) return null;

  // Clean the phone number (remove spaces, symbols)
  const cleanPhone = settings.phone.replace(/\D/g, '');
  // Default to India code +91 if not specified
  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with EDIZO support on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <span className="sr-only">Chat with EDIZO support on WhatsApp</span>
        <MessageCircle size={28} aria-hidden="true" />
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75"></span>
      </motion.a>
    </div>
  );
};

export default WhatsAppBubble;
