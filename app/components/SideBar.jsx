import React from "react";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Link,
  Divider,
  Button,
} from "@nextui-org/react";
import {
  FaHouse,
  FaXmark,
  FaCheck,
  FaPlus,
  FaUsers,
  FaPowerOff,
} from "react-icons/fa";
import useTranslation from "./translation";

function SideBar({ avatarURl, projects, user, logout }) {
  const [locale, setLocale] = useState("en"); // idioma por defecto
  const translations = useTranslation(locale);
  const handleChangeLanguage = (lang) => {
    setLocale(lang);
  };
  return (
    <div className="">
      <aside className="hidden h-screen px-8 py-12 w-36 sm:block md:w-48">
        <div className="flex flex-col items-center gap-4">
          <Avatar src={avatarURl} className="h-24 w-24" />
        </div>
        <Divider className="my-4 bg-white" />
        <div className="relative py-8">
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Projects"
              indicator={({ isOpen }) => (isOpen ? <FaXmark /> : <FaCheck />)}
              title={
                <span style={{ color: "white" }}>
                  {translations.sidebar_projects}
                </span>
              }
            >
              <ul>
                {projects.map((project) => (
                  <li key={project.id} className="py-4">
                    <Link
                      href={`/dashboard/${project.project_name}`}
                      className="text-white hover:text-gray-300"
                    >
                      <div className="flex items-center gap-x-2">
                        <FaHouse />
                        <span className="text-white uppercase hover:underline">
                          {project.project_name}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
          {user.rol === "admin" && (
            <Accordion>
              <AccordionItem
                key="4"
                aria-label="Information"
                indicator={({ isOpen }) => (isOpen ? <FaXmark /> : <FaCheck />)}
                title={
                  <span style={{ color: "white" }}>
                    {translations.sidebar_updateClientProject}
                  </span>
                }
              >
                <Link
                  href="/create-project"
                  className="text-white hover:text-gray-300"
                >
                  <ul>
                    <li>
                      <div className="flex items-center gap-x-2">
                        <FaPlus />
                        <span className="text-white uppercase hover:underline">
                          {translations.sidebar_updateClientProject}
                        </span>
                      </div>
                    </li>
                  </ul>
                </Link>
              </AccordionItem>
              <AccordionItem
                key="5"
                aria-label="Information"
                indicator={({ isOpen }) => (isOpen ? <FaXmark /> : <FaCheck />)}
                title={
                  <span style={{ color: "white" }}>
                    {translations.sidebar_createClient}
                  </span>
                }
              >
                <Link
                  href="/panel-control"
                  className="text-white hover:text-gray-300"
                >
                  <ul>
                    <li>
                      <div className="flex items-center gap-x-2">
                        <FaUsers />
                        <span className="text-white uppercase hover:underline">
                          {translations.sidebar_createClient}
                        </span>
                      </div>
                    </li>
                  </ul>
                </Link>
              </AccordionItem>
            </Accordion>
          )}
        </div>
        <div className="flex items-end justify-start">
          <Button
            className="text-white bg-[#a32054] hover:bg-[#395788] w-96"
            onClick={logout}
          >
            <FaPowerOff />
            {translations.sidebar_logout}
          </Button>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
