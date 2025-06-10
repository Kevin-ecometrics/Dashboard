const Progress = ({
  value,
  maxValue = 100,
  color,
  label,
  showValueLabel = false,
}) => {
  const percentage = (value / maxValue) * 100;
  const colorClasses = {
    danger: "bg-red-500",
    warning: "bg-yellow-500",
    primary: "bg-blue-500",
    success: "bg-green-500",
  };

  return (
    <div className="w-full max-w-md">
      {label && <div className="text-sm text-white mb-2">{label}</div>}
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValueLabel && (
        <div className="text-sm text-white mt-1 text-right">{value}%</div>
      )}
    </div>
  );
};

export default Progress;
