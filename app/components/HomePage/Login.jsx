"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { league, poppins } from "@/app/fonts";
import api_URL from "@/app/utils/api";
import Image from "next/image";

// Traducciones incrustadas directamente
const translations = {
  en: {
    login_welcome: "Welcome",
    login_letsGetStarted: "Let's get started",
    login_emailPlaceholder: "Email",
    login_passwordPlaceholder: "Password",
    login_enter: "Login",
    login_error: "Login failed. Please try again.",
    login_allRightsReserved: "All rights reserved",
  },
  es: {
    login_welcome: "Bienvenido",
    login_letsGetStarted: "Vamos a comenzar",
    login_emailPlaceholder: "Correo electrónico",
    login_passwordPlaceholder: "Contraseña",
    login_enter: "Entrar",
    login_error: "Error al iniciar sesión. Inténtalo de nuevo.",
    login_allRightsReserved: "Todos los derechos reservados",
  },
};

function Login({ goToLanding }) {
  const router = useRouter();
  const [locale, setLocale] = useState("en");
  const t = translations[locale];
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const year = new Date().getFullYear();

  const notify = (message) => toast.error(message);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    try {
      const response = await axios.post(
        `${api_URL}/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        router.push("/dashboard");
      } else {
        notify(t.login_error);
      }
    } catch (error) {
      notify(t.login_error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${api_URL}/api/user`, {
          withCredentials: true,
        });
        if (res.data.user) {
          setUser(res.data.user);
          router.push("/dashboard");
        }
      } catch {}
    };
    fetchUser();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-screen w-screen text-black relative">
      <section className="col-span-2 bg-[url(/hero.webp)] bg-cover bg-center text-white h-screen" />
      <section className="col-span-1 bg-white flex items-center justify-center min-h-[600px] relative">
        <div className={`${league.className} font-bold text-center px-4 `}>
          <div className="mb-6 absolute top-8 right-8">
            <button
              onClick={() => setLocale(locale === "en" ? "es" : "en")}
              className="text-blue-600 text-xl hover:scale-110 transition-transform"
              title={
                locale === "en" ? "Cambiar a Español" : "Switch to English"
              }
            >
              {locale === "en" ? (
                <Image
                  src="/MX.svg"
                  width={40}
                  height={40}
                  alt="Bandera de México"
                  className="shadow-md"
                />
              ) : (
                <Image
                  src="/USA.svg"
                  width={40}
                  height={40}
                  alt="USA Flag"
                  className="shadow-md"
                />
              )}
            </button>
          </div>
          <h1 className={`${poppins.className} text-[#33244c] text-3xl`}>
            {t.login_welcome}
          </h1>
          <p className="text-xl text-black mb-6">{t.login_letsGetStarted}</p>

          <form onSubmit={handleSubmit} className="space-y-4 w-80">
            <input
              type="email"
              id="email"
              placeholder={t.login_emailPlaceholder}
              required
              className="w-full p-2.5 rounded-lg border border-gray-300 text-sm"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={t.login_passwordPlaceholder}
                required
                className="w-full p-2.5 rounded-lg border border-gray-300 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg border border-gray-300 hover:bg-[#361F4C] hover:text-white text-sm transition-colors duration-300"
            >
              {t.login_enter}
            </button>
          </form>

          <div className="mt-10 text-[#969696] text-sm hidden md:block">
            {t.login_allRightsReserved} {year}
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={goToLanding}
              className="mt-4 bg-white text-[#BD155C] hover:text-white hover:bg-[#BD155C] transition
              duration-300 px-8 py-2 rounded-xl shadow-lg border border-[#BD155C] text-sm"
            >
              {locale === "en" ? "Go to e-commetrics" : "Ir a e-commetrics"}
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    </div>
  );
}

export default Login;
