"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { inter, league, poppins } from "@/app/fonts";
import api_URL from "../utils/api";
function Login({ emailPlaceholder, passwordPlaceholder }) {
  const router = useRouter();
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
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      notify("Error al iniciar sesión, revise sus datos e intente de nuevo");
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
          "Error El Usuario no esta loggeado:",
          error.response.data
        );
      }
    };
    fetchUser();
  });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 h-screen w-screen">
      <section
        style={{
          background: "url('/background.webp')",
          backgroundSize: "cover",
        }}
        className="col-span-2 h-screen flex justify-center items-center text-white"
      >
        <div className={`${inter.className} font-medium`}>
          <div className="flex items-center gap-8">
            <Image
              width={877}
              height={178}
              src="/logo_background.webp"
              alt="logo"
            />
          </div>
          <div className="my-2">
            <h2 className="text-4xl text-center">
              Innovate - Elevate - Simplify
            </h2>
          </div>
        </div>
      </section>
      <section className=" col-span-1 bg-white">
        <div className={`${league.className} font-bold`}>
          <div className="px-2 gap-4  h-screen flex justify-center items-center flex-col">
            <h1 className={`${poppins.className} text-[#33244c] text-[30px]`}>
              ¡Welcome!
            </h1>
            <p className="text-[25px] text-black">Let´s Get Started.</p>
            <form
              onSubmit={handleSubmit}
              className={`${league.className} font-medium`}
            >
              <div className="mb-5">
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border text-gray-900 border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-   dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={emailPlaceholder}
                  required
                />
              </div>
              <div className="mb-5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={passwordPlaceholder}
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
                  Enter
                </button>
              </div>
              <Toaster />
            </form>
            <div className="fixed bottom-10 text-center hidden md:block text-[#969696]">
              <span className="text-sm">
                © Ecommetrica 2024 All rights reserved
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
