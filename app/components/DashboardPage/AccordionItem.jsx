import { useState, useRef, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const AccordionItem = ({ children, title, indicator }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-gray-800 hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
      >
        <span className="text-white">{title}</span>
        <span className="text-white">
          {indicator ? (
            indicator({ isOpen })
          ) : isOpen ? (
            <FaChevronUp />
          ) : (
            <FaChevronDown />
          )}
        </span>
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="transition-all duration-500 ease-in-out overflow-hidden bg-gray-900"
      >
        <div className="px-4 py-3">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;
