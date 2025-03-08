import { useEffect, useState } from "react";

const useTranslation = (locale) => {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      const res = await fetch(`/messages/${locale}.json`);
      const data = await res.json();
      setTranslations(data);
    };

    loadTranslations();
  }, [locale]);

  return translations;
};

export default useTranslation;
