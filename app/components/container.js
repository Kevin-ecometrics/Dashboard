import React from "react";

const Container = ({ title }) => {
  return (
    <div className="py-8 text-center">
      <h1 className="text-4xl font-medium text-white">{title}</h1>
    </div>
  );
};

export default Container;
