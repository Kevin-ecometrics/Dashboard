// Componente Button nativo
const Button = ({ children, onClick, className, href }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
