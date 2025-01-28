"use client";
import React from "react";
import Image from "next/image";
import { montse } from "../fonts";
function Page() {
  return (
    <div className="flex">
      <aside className="w-[320px] bg-[#2F1945] h-screen transform transition-transform duration-500 ease-in-out translate-x-0">
        <div className="flex justify-center items-center flex-col">
          <div class="relative inline-flex items-center justify-center mt-8 size-28 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <img src="/reforma logo.png" alt="" />
          </div>
          <h1 className={`${montse.className} py-4 text-[23px] font-bold`}>
            Administrador
          </h1>
          <hr className="border border-white w-full" />
        </div>
      </aside>
      <section
        className="w-full h-screen"
        style={{
          background: "linear-gradient(to top, #301846, #847EFC, #3A228B)",
        }}
      >
        2
      </section>
    </div>
  );
}

export default Page;
