import { FaWhatsapp } from "react-icons/fa";

const WhatsApp = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/526646429633"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-400 transition-colors duration-300 animate-pulse"
      >
        <FaWhatsapp className="w-6 h-6" />
      </a>
    </div>
  );
};

export default WhatsApp;
