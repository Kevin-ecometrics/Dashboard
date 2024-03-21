"use client";
import React from "react";
import { Link } from "react-scroll";

function HeroAnimation() {
  return (
    <div
      id="principal"
      className="relative h-screen main_container bg-gradient-to-r from-[#201A48]  to-[#861453]"
      style={{ borderRadius: "0 0 100% 100% / 0 0 10vw 10vw" }}
    >
      <div className="e_container">
        <div className="e_card">
          <h1 className="text-gray-400">
            Ecommerce is:
            {/* Scroller Start */}
            <div className="scroller">
              <span>
                <span className="word logi">Logistics</span>
                <br />
                <span className="word tech">Technology</span>
                <br />
                <span className="word mark">Marketing</span>
              </span>
            </div>
            <div className="note" />
            <div>
              <p className="grow-text">GROW Products &amp; Services</p>
            </div>
          </h1>
        </div>
        {/* Contenedor de los círculos */}
        <div className="circle-container">
          <svg
            width={400}
            height={400}
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Círculo Amarillo */}
            <circle cx={140} cy={230} r={100} fill="rgba(255, 193, 7, 0.8)" />
            {/* Círculo Naranja */}
            <circle cx={260} cy={230} r={100} fill="rgba(255, 87, 34, 0.8)" />
            {/* Círculo Azul */}
            <circle cx={200} cy={140} r={100} fill="rgba(33, 150, 243, 0.8)" />
          </svg>
        </div>
      </div>
      <div className="text-center button-container">
        <button
          className="bg-red-500 p-2 rounded-xl"
          style={{ marginTop: "38rem" }}
        >
          <Link to="services" smooth={true} duration={1000} spy={true}>
            Try 1st Session
          </Link>
        </button>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        .main_container {\n            box-sizing: border-box;\n            margin: 0;\n            padding: 0;\n                       height: 700px;\n            overflow: hidden;\n        }\n\n        .main_container h1 {\n            font-weight: normal;\n            font-size: 1.5em;\n        }\n\n        /* Estilos para el contenedor de la imagen de fondo */\n        .e_container {\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            width: 800px;\n            height: 400px;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n        }\n\n        .e_card {\n            font-size: 1.5em;\n            text-align: justify;\n            background-color: #f8f8f8;\n            border-radius: 1.5em;\n\n            padding: 2.6em 3.8em;\n            cursor: pointer;\n            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1),\n                0 8px 8px rgba(0, 0, 0, 0.1),\n                0 16px 16px rgba(0, 0, 0, 0.1),\n                0 32px 32px rgba(0, 0, 0, 0.15),\n                0 64px 64px rgba(0, 0, 0, 0.15);\n        }\n        /* Scroller y demás estilos... */\n        .scroller {\n            height: 1.4em;\n            line-height: 1.3em;\n            position: relative;\n            overflow: hidden;\n            width: 6em;\n            margin-top: 20px;\n        }\n\n        .scroller > span {\n            position: absolute;\n            top: 0;\n            animation: slide 6s infinite;\n            font-weight: bold;\n        }\n\n        .note::after {\n            content: '';\n            width: 50%;\n            height: 2px;\n            border-radius: 999px;\n            background-color: #932da9;\n            position: absolute;\n            top: -1.8em;\n        }\n\n        .note {\n            color: #9f20b5;\n            position: relative;\n            margin-top: 3em;\n        }\n\n        .word.tech {\n            color: #E2DF26 /* Amarillo */\n        }\n\n        .word.mark{\n            color: \t#FE9A09 /* Naranja*/\n        }\n\n        .word.logi{\n            color: #1E90FF; /* Azul */\n        }\n\n        .circle-container {\n            gap: 2rem;\n            animation-name: rotateClockwise;\n            animation-duration: 6s;\n            animation-timing-function: ease-in-out;\n            animation-iteration-count: infinite;\n        }\n\n        @keyframes rotateClockwise {\n            0% {\n                transform: rotate(0deg);\n            }\n            100% {\n                transform: rotate(360deg);\n            }\n        }\n\n        @keyframes slide {\n            0% {\n                top: 0;\n            }\n            25% {\n                top: -0.2em;\n            }\n            50% {\n                top: -1.6em;\n            }\n            80% {\n                top: -2.5em;\n            }\n        }\n\n        .main_container p {\n            font-size: 1em;\n            overflow: hidden;\n            white-space: nowrap;\n            margin: 0 auto;\n            border-right: 0.15em solid  #6a329f;\n            animation: typing 4s steps(20) 1s 1 normal both, blink 1s steps(1)\n            infinite;\n        }\n\n        @keyframes typing {\n            from {\n                width: 0;\n            }\n            to {\n                width: 100%;\n            }\n        }\n\n        @keyframes blink {\n            50% {\n                border-color: transparent;\n            }\n        }\n\n        @media (min-width: 768px) and (max-width: 1200px) {\n            /* Estilos para pantallas medianas */\n            .e_container {\n                position: absolute;\n            }\n\n        }\n\n        @media (max-width: 768px) {\n            .circle-container{\n                position: absolute;\n                transform: translate(-50%, -50%);\n            }\n\n            .e_card {\n                visibility: hidden;\n            }\n\n            .grow-text {\n                visibility: hidden;\n            }\n        }\n\n    ",
        }}
      />
    </div>
  );
}

export default HeroAnimation;
