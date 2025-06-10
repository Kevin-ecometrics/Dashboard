// Componente Link nativo
const Link = ({ href, children, className, target }) => (
  <a
    href={href}
    target={target}
    className={`${className} transition-colors duration-200`}
  >
    {children}
  </a>
);

export default Link;
