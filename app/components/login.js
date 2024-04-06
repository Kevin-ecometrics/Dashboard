"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { inter, league } from "@/app/fonts";
function Login({ emailPlaceholder, passwordPlaceholder }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const notify = (message) => toast.error(message);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    try {
      const response = await axios.post(
        // `https://e-commetrics.com/login `,
        `http://localhost:3001/login`,

        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        router.push("/home");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      notify("Error al iniciar sesión, revise sus datos e intente de nuevo");
    }
  };
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-5 h-screen w-screen"
      style={{ background: "url('/bg-login.png')" }}
    >
      <section className="col-span-3 h-screen flex justify-center items-center text-white">
        <div className={`${inter.className} font-medium`}>
          <div className="flex items-center gap-8">
            <Image
              src="/logo.svg"
              alt="logo"
              className="size-16 md:size-24"
              width={200}
              height={200}
            />
            <h1 className="text-4xl md:text-8xl">Ecommetrica</h1>
          </div>
          <div className="my-8">
            <h2 className="text-4xl text-center my-4">where innovation and</h2>
            <h2 className="text-4xl text-center">online commerce meet!</h2>
          </div>
        </div>
      </section>
      <section className="col-span-2 bg-white">
        <div className={`${league.className} font-bold`}>
          <div className="px-2 gap-8 h-screen flex justify-center items-center flex-col">
            <h1 className="text-[#33244c] text-5xl">Lets Get Started</h1>
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
                  className="bg-[#395788] hover:bg-[#446498] text-white text-sm font-medium rounded-lg py-2.5 w-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>
              <Toaster />
            </form>
            <div className="absolute bottom-16 right-52 text-start hidden md:block text-[#969696]">
              <span className="text-sm">
                All rights reserved © Ecommetrica 2024
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
