"use client";

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/app/components/HomePage/Login";

// Lazy import del componente Landing
const LazyLanding = lazy(() => import("@/app/components/HomePage/Landing"));

export default function Page() {
  const [selectedOption, setSelectedOption] = useState(null);

  // Función para cambiar a login desde landing o login
  const goToLogin = () => setSelectedOption("login");
  // Función para cambiar a landing desde landing o login
  const goToLanding = () => setSelectedOption("landing");

  return (
    <div className="overflow-x-hidden min-h-screen">
      {/* Modal Inicial */}
      <AnimatePresence>
        {selectedOption === null && (
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-l from-[#BD155C] to-[#1E171E]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                ¿Qué deseas hacer?
              </h2>
              <button
                onClick={() => setSelectedOption("login")}
                className="w-full bg-[#BD155C] hover:bg-[#BD155C]/90 text-white py-2 px-4 rounded-lg mb-3 transition duration-200"
              >
                Ingresar al Dashboard
              </button>
              <button
                onClick={() => setSelectedOption("landing")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-lg transition duration-200"
              >
                Conocer E-commetrics
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenido según selección */}
      {selectedOption === "login" && <Login goToLanding={goToLanding} />}

      {selectedOption === "landing" && (
        <Suspense
          fallback={
            <div className="text-center py-10">Cargando información...</div>
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LazyLanding goToLogin={goToLogin} />
          </motion.div>
        </Suspense>
      )}
    </div>
  );
}
