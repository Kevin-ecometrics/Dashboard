import React from "react";
function Hero() {
  return (
    <div
      className="flex justify-center w-auto px-16 items-center flex-col md:flex-row py-8 md:rounded-b-[300px]"
      style={{
        backgroundImage: `url(/Hero.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="md:block animate-spin animate-duration-[4000ms]">
        <svg
          width={400}
          height={400}
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx={200} cy={140} r={100} fill="rgba(33, 150, 243, 0.8)" />
          <circle cx={140} cy={230} r={100} fill="rgba(255, 193, 7, 0.8)" />
          <circle cx={260} cy={230} r={100} fill="rgba(255, 87, 34, 0.8)" />
        </svg>
      </div>
    </div>
  );
}

export default Hero;
