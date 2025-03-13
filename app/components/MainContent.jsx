import React, { useState } from "react";
import {
  Divider,
  Progress,
  Chip,
  Button,
  Link,
  TypeAnimation,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import useTranslation from "./translation";

function MainContent({ projects, currentIndex, numberOfButtons, logout }) {
  const [locale, setLocale] = useState("en"); // idioma por defecto
  const translations = useTranslation(locale);
  const handleChangeLanguage = (lang) => {
    setLocale(lang);
  };
  return (
    <div>
      <div className="flex flex-col w-screen md:w-4/5 bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900">
        <div className="py-8 text-center text-white">
          <TypeAnimation
            sequence={[
              // Same substring at the start will only be typed out once, initially
              "{translations.main_welcome}",
              1000, // wait 1s before replacing "Mice" with "Hamsters"
              "{translations.main_ecommetrica}",
              1000,
            ]}
            wrapper="span"
            speed={10}
            style={{ fontSize: "2em", display: "inline-block" }}
          />
        </div>
        <Divider className="my-12 bg-white" />
        <div className="flex flex-col items-center justify-center px-2 md:gap-12 md:flex-row">
          {projects.slice(currentIndex, currentIndex + 3).map((project) => (
            <motion.div
              key={project.id}
              className="flex [&>div]:text-white [&>h2]:text-white [&>p]:text-white flex-col w-[300px] h-full rounded-2xl shadow-2xl"
              style={{
                backgroundImage: `url('/bg-card.png')`, // Reemplaza esto con la ruta a tu imagen
                backgroundSize: "cover", // Esto hace que la imagen cubra todo el div
                backgroundRepeat: "no-repeat", // Esto evita que la imagen se repita
              }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`${titillium.className} font-semibold`}>
                <h2 className="py-6 px-2 text-center text-4xl">
                  {project.title}
                </h2>
              </div>
              <div className={`${montse.className} font-light`}>
                <p className="px-4 py-4 text-center">{project.content}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-8 p-4">
                <Progress
                  label="project progress"
                  size="md"
                  value={project.percentage}
                  maxValue={100}
                  color={getColor(project.percentage)}
                  showValueLabel={true}
                  className="max-w-md"
                />
                <div className="mt-auto">
                  {user.rol === "admin" ? (
                    <Link
                      className="text-white"
                      href={`/dashboard/${project.project_name}`}
                    >
                      <Chip
                        startContent={<FaCheck size={18} />}
                        variant="faded"
                        color="primary"
                      >
                        {project.percentage === 100
                          ? "{translations.main_projectCompleted}"
                          : "{translations.main_projectInProgress}"}
                      </Chip>
                    </Link>
                  ) : (
                    <Button className="bg-[#a32054] hover:bg-[#395788]">
                      <Link
                        className="text-white"
                        href={`/dashboard/${project.project_name}`}
                      >
                        {translations.main_goToProject}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center md:justify-end py-4 items-center gap-4 md:w-[89%]">
          {numberOfButtons > 1 &&
            Array.from({ length: numberOfButtons }, (_, index) => (
              <button
                className="px-6 py-2 border border-white rounded-lg text-white"
                style={{
                  backgroundImage: `url('/bg-card.png')`, // Reemplaza esto con la ruta a tu imagen
                  backgroundSize: "cover", // Esto hace que la imagen cubra todo el div
                  backgroundRepeat: "no-repeat", // Esto evita que la imagen se repita
                }}
                key={index}
                onClick={() => handleButtonClick(index)}
              >
                {index + 1}
              </button>
            ))}
        </div>
        <div className="flex items-center justify-center p-4 ">
          <Button
            className="block text-white bg-[#a32054] sm:hidden hover:bg-[#395788] w-80"
            onClick={logout}
          >
            {translations.main_logout}
          </Button>
        </div>
        <div className="absolute top-0 right-0 p-8">
          <Link href="https://wa.me/+526646429633" target="_blank">
            <FaWhatsapp className="text-green-500 h-12 w-24" />
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
