"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Navbar from "../components/navbar";
import Animation from "../components/hero_animation";
function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const res = await axios.get(`https://e-commetrics.com/api/user`, {
        const res = await axios.get(`https://e-commetrics.com/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error.response.data);
      }
    };
    fetchUser();
  }, []); // Nota el array vacío aquí
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <div className="flex items-center justify-center text-4xl text-blue-400 border-8 border-gray-300 rounded-full w-28 h-28 animate-spin border-t-blue-400">
            <Image alt="loading" src="/logo.png" width={100} height={100} />
          </div>
          <div className="mt-4 text-2xl text-white">Loading...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white h-screen">
      <section className="[&>h1]:text-black [&>p]:text-black">
        <Navbar />
        <Animation />
      </section>
    </div>
  );
}

export default Home;
