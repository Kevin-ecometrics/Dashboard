"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Packages from "@/app/components/HomePage/Packages";

const Hero = ({ locale }) => {
  const words =
    locale === "en"
      ? ["Simplify", "Elevate", "Innovate", "E-commetrics"]
      : ["Simplifica", "Eleva", "Innova", "E-commetrics"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000); // Change word every 2 seconds
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <motion.section
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center"
      style={{
        background: "linear-gradient(to left, #BD155C, #1E171E)",
      }}
    >
      <h1
        className="text-white font-extrabold text-5xl md:text-7xl mb-3 drop-shadow-lg"
        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}
      >
        <motion.span
          key={currentWordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {words[currentWordIndex]}
        </motion.span>
      </h1>
      <p
        className="text-white text-xl md:text-2xl max-w-3xl"
        style={{ color: "#E2D8F9" }}
      >
        {locale === "en"
          ? "Smart websites. Consulting and development in one place."
          : "Páginas web inteligentes. Consultoría y desarrollo en un solo lugar."}
      </p>
    </motion.section>
  );
};

const Footer = ({ locale, goToLogin }) => (
  <motion.footer
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.7 }}
    className="text-center py-6 min-h-32 flex justify-center items-center"
    style={{
      background: "linear-gradient(to left, #BD155C, #1E171E)",
    }}
  >
    <p className="text-sm mb-8">
      {locale === "en"
        ? `E-commetrics © ${new Date().getFullYear()} All rights reserved.`
        : `E-commetrics © ${new Date().getFullYear()} Todos los derechos reservados.`}
    </p>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <button
        onClick={goToLogin}
        className="text-sm bg-white text-[#BD155C] hover:bg-[#BD155C] px-8 py-2 hover:text-white rounded-xl transition-colors"
      >
        {locale === "en" ? "Go to Login" : "Ir a Iniciar Sesión"}
      </button>
    </div>
  </motion.footer>
);

export default function Landing({ goToLogin }) {
  const [locale, setLocale] = useState("es");

  return (
    <div className="relative min-h-screen">
      {/* Botón de idioma */}
      <div className="absolute top-8 right-8 z-50">
        <button
          onClick={() => setLocale(locale === "en" ? "es" : "en")}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform bg-white"
          title={locale === "en" ? "Cambiar a Español" : "Switch to English"}
          aria-label="Cambiar idioma"
        >
          {locale === "en" ? (
            <figure>
              <Image
                src="/MX.svg"
                width={36}
                height={36}
                alt="Bandera de México"
              />
            </figure>
          ) : (
            <figure>
              <Image src="/USA.svg" width={36} height={36} alt="USA Flag" />
            </figure>
          )}
        </button>
      </div>

      <Hero locale={locale} />
      <Packages locale={locale} />
      <Footer locale={locale} goToLogin={goToLogin} />
    </div>
  );
}
