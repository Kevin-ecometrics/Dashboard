"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { inter, league, poppins } from "../fonts";
import api_URL from "../utils/api";
import useTranslation from "./translation";

function Login({ emailPlaceholder, passwordPlaceholder }) {
  const router = useRouter();
  const [locale, setLocale] = useState('en'); // idioma por defecto
  const translations = useTranslation(locale);
  const year = new Date().getFullYear();
  const handleChangeLanguage = (lang) => {
    setLocale(lang);
  };
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
        console.log(translations.login_failed);
      }
    } catch (error) {
      console.error("Error:", error);
      notify(translations.login_error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${api_URL}/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(
          translations.login_userNotLoggedIn,
          error.response.data
        );
      }
    };
    fetchUser();
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-screen w-screen">
      <section
        className="col-span-2 flex justify-center bg-center bg-cover text-white bg-[url(/hero.webp)] h-screen "
      >

      </section>
      <section className=" col-span-1 bg-white">
        <div className={`${league.className} font-bold`}>
          <div className="px-2 gap-4  h-screen flex justify-center items-center flex-col">
          
{/*
  <div className="flex justify-center space-x-4">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={() => handleChangeLanguage("en")}
    >
      English
    </button>
    <button
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      onClick={() => handleChangeLanguage("es")}
    >
      Español
    </button>
  </div>
*/}
      
            <h1 className={`${poppins.className} text-[#33244c] text-[30px]`}>
              {translations.login_welcome}
            </h1>
            <p className="text-[25px] text-black">{translations.login_letsGetStarted}</p>
            <form
              onSubmit={handleSubmit}
              className={`${league.className} font-medium`}
            >
              <div className="mb-5">
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border text-gray-900 border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={translations.login_emailPlaceholder}
                  required
                />
              </div>
              <div className="mb-5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={translations.login_passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-4 right-2 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash color="black" />
                  ) : (
                    <FaEye color="black" />
                  )}
                </button>
              </div>
              <div className="mb-5">
                <button
                  type="submit"
                  className="text-black hover:bg-[#361F4C] hover:text-white border border-gray-300 text-sm font-medium rounded-lg py-2.5 w-full focus:ring-offset-2"
                >
                  {translations.login_enter}
                </button>
              </div>
              <Toaster />
            </form>
            <div className="fixed bottom-10 text-center hidden md:block text-[#969696]">
              <span className="text-sm">
              {translations.login_allRightsReserved}{year}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
