// Componente Chip nativo
const Chip = ({ children, startContent, variant, color }) => {
  const colorClasses = {
    primary: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
        colorClasses[color] || "bg-gray-100 text-gray-800 border-gray-300"
      }`}
    >
      {startContent}
      {children}
    </span>
  );
};

export default Chip;
