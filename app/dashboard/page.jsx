"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Progress from "../components/DashboardPage/Progress";
import Avatar from "../components/DashboardPage/Avatar";
import Divider from "../components/DashboardPage/Divider";
import Button from "../components/DashboardPage/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "../components/DashboardPage/Link";
import Chip from "../components/DashboardPage/Chip";
import useTranslation from "../components/translation";
import {
  FaCheck,
  FaXmark,
  FaPowerOff,
  FaArrowLeft,
  FaArrowRight,
  FaHouse,
  FaPlus,
  FaUsers,
  FaWhatsapp,
  FaX,
  FaBars,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Accordion from "../components/DashboardPage/Accordion";
import AccordionItem from "../components/DashboardPage/AccordionItem";
import { TypeAnimation } from "react-type-animation";
import { titillium, montse } from "../fonts";
import api_URL from "../utils/api";
import WhatsApp from "../components/DashboardPage/Whatsapp";

function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [locale, setLocale] = useState("en");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const translations = useTranslation(locale);
  const router = useRouter();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleNext = () => {
    const maxIndex = projects.length - (isMobile ? 1 : 3);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, maxIndex));
  };

  const handlePrev = () => {
    const maxIndex = projects.length - (isMobile ? 1 : 3);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, maxIndex - 1) : prevIndex - 1
    );
  };

  const handleChangeLanguage = (lang) => {
    setLocale(lang);
  };

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const res = await axios.get(`${api_URL}/api/user`, {
          withCredentials: true,
        });
        if (res?.data?.user) {
          setUser(res.data.user);
          const resProjects = await axios.get(
            `${api_URL}/api/projects?userId=${res.data.user.id}`,
            { withCredentials: true }
          );
          if (resProjects?.data) {
            setProjects(resProjects.data);
          }
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };
    fetchUserAndProjects();
  }, [router]);

  const logout = async () => {
    try {
      await axios.post(`${api_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const getColor = (value) => {
    if (value >= 0 && value <= 35) return "danger";
    if (value > 35 && value <= 70) return "warning";
    if (value > 70 && value <= 99) return "primary";
    if (value === 100) return "success";
    return "primary";
  };

  const getAvatarUrl = (email) => {
    const avatarMap = {
      "juanmanuel@e-commetrics.com": "/logo_nav.jpg",
      "kevin@e-commetrics.com": "/logo_nav.jpg",
      "mydentist@reformadental.com": "/reforma logo.png",
      "dsolis@syltalento.com": "/SYL logo.jpeg",
      "draanyimanchola@bitescreadoresdesonrisas.com": "/bites logo.png",
    };
    return avatarMap[email] || "/logo_nav.jpg";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <div className="flex items-center justify-center text-4xl text-blue-400 border-8 border-gray-300 rounded-full w-28 h-28 animate-spin border-t-blue-400">
            <Image alt="loading" src="/logo.png" width={100} height={100} />
          </div>
          <div className="mt-4 text-2xl text-gray-800">
            {translations.dashboard_loading}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="h-screen w-screen text-white bg-[#21233A] overflow-x-hidden relative">
      <div className="flex bg-[#191c33]">
        {/* Toggle button para desktop */}
        {!isAsideOpen && (
          <div
            className="absolute left-0 text-2xl right-0 p-8 z-50 hidden md:block cursor-pointer"
            onClick={toggleAside}
          >
            <FaBars className="text-2xl hover:text-[#a32054] transition-colors" />
          </div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 bg-[#1a1a2e] text-white shadow-lg px-6 w-full md:w-96 z-40 py-8 transform transition-transform duration-300 ${
            isAsideOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <Avatar src={getAvatarUrl(user.email)} className="h-24 w-24" />

            <button
              className="absolute top-0 right-0 p-4 md:block hidden hover:text-[#a32054] transition-colors"
              onClick={toggleAside}
            >
              <FaX className="text-2xl" />
            </button>
          </div>

          <Divider className="my-4 bg-white" />

          <div className="relative py-8 ">
            <Accordion>
              <AccordionItem
                title={translations.dashboard_projects}
                indicator={({ isOpen }) => (isOpen ? <FaXmark /> : <FaCheck />)}
              >
                <ul className="space-y-4 ">
                  {projects.map((project) => (
                    <li key={project.id}>
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
              <div className="mt-2">
                <Accordion>
                  <AccordionItem
                    title={translations.dashboard_updateClientProject}
                    indicator={({ isOpen }) =>
                      isOpen ? <FaXmark /> : <FaCheck />
                    }
                  >
                    <Link
                      href="/create-project"
                      className="text-white hover:text-gray-300"
                    >
                      <div className="flex items-center gap-x-2">
                        <FaPlus />
                        <span className="text-white uppercase hover:underline">
                          {translations.dashboard_updateClientProjectAction}
                        </span>
                      </div>
                    </Link>
                  </AccordionItem>

                  <AccordionItem
                    title={translations.dashboard_createClient}
                    indicator={({ isOpen }) =>
                      isOpen ? <FaXmark /> : <FaCheck />
                    }
                  >
                    <Link
                      href="/panel-control"
                      className="text-white hover:text-gray-300"
                    >
                      <div className="flex items-center gap-x-2">
                        <FaUsers />
                        <span className="text-white uppercase hover:underline">
                          {translations.dashboard_createClientAction}
                        </span>
                      </div>
                    </Link>
                  </AccordionItem>

                  <AccordionItem
                    title={translations.dashboard_generateVCard}
                    indicator={({ isOpen }) =>
                      isOpen ? <FaXmark /> : <FaCheck />
                    }
                  >
                    <Link
                      href="/vcard"
                      className="text-white hover:text-gray-300"
                    >
                      <div className="flex items-center gap-x-2">
                        <FaUsers />
                        <span className="text-white uppercase hover:underline">
                          {translations.dashboard_generateVCardAction}
                        </span>
                      </div>
                    </Link>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>

          <div className="flex items-end justify-start mt-auto">
            <Button
              className="text-white bg-[#a32054] hover:bg-[#395788] w-full transition-colors"
              onClick={logout}
            >
              <FaPowerOff />
              {translations.dashboard_logout}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-col w-screen bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900">
          <div className="py-8 text-center text-white">
            <TypeAnimation
              sequence={[
                translations.dashboard_welcome,
                1000,
                translations.dashboard_ecommetrica,
                1000,
              ]}
              wrapper="span"
              speed={10}
              style={{ fontSize: "2em", display: "inline-block" }}
            />
          </div>

          <Divider className="my-12 bg-white" />

          <div className="flex flex-col items-center justify-center w-full relative">
            {/* Flechas navegación Desktop */}
            {!isMobile && (
              <>
                <button
                  onClick={handlePrev}
                  className="fixed left-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-[#a32054] rounded-full hover:bg-[#395788] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                  <FaArrowLeft size={24} />
                </button>

                <button
                  onClick={handleNext}
                  className="fixed right-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-[#a32054] rounded-full hover:bg-[#395788] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                  <FaArrowRight size={24} />
                </button>
              </>
            )}

            {/* Contenedor de tarjetas */}
            <div className="flex justify-center w-full px-4">
              <div className="flex gap-6 w-full max-w-[1100px] overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {projects
                    .slice(currentIndex, currentIndex + (isMobile ? 1 : 3))
                    .map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="flex flex-col w-[300px] h-[700px] rounded-2xl shadow-2xl text-white overflow-hidden mx-auto bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url('/bg-card.png')` }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }} // más rápido y sin delay
                        transition={{
                          duration: 0.2, // exit más corto
                          ease: [0.25, 0.46, 0.45, 0.94],
                          delay: index * 0.1, // solo para animate
                        }}
                      >
                        {/* Título */}
                        <div
                          className={`${titillium.className} font-semibold py-6 px-2 text-center`}
                        >
                          <h2 className="text-3xl md:text-4xl">
                            {project.title}
                          </h2>
                        </div>

                        {/* Descripción */}
                        <div
                          className={`${montse.className} font-light px-4 py-4 text-center`}
                        >
                          <p>{project.content}</p>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col items-center justify-center gap-8 p-4 mt-auto">
                          <Progress
                            label="project progress"
                            value={project.percentage}
                            color={getColor(project.percentage)}
                            showValueLabel
                          />

                          {user.rol === "admin" ? (
                            <Link
                              href={`/dashboard/${project.project_name}`}
                              className="text-white"
                            >
                              <Chip
                                startContent={<FaCheck size={18} />}
                                variant="faded"
                                color="primary"
                                className="cursor-pointer"
                              >
                                {project.percentage === 100
                                  ? "Project completed"
                                  : "Project in progress"}
                              </Chip>
                            </Link>
                          ) : (
                            <Button
                              as={Link}
                              href={`/dashboard/${project.project_name}`}
                              className="bg-[#a32054] hover:bg-[#395788] text-white transition-colors"
                            >
                              {translations.dashboard_goToProject}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Flechas navegación Mobile */}
            {isMobile && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handlePrev}
                  className="p-4 bg-[#a32054] rounded-full hover:bg-[#395788] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                  <FaArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-4 bg-[#a32054] rounded-full hover:bg-[#395788] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                  <FaArrowRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile logout button */}
          <div className="flex items-center justify-center p-4">
            <Button
              className="block text-white bg-[#a32054] sm:hidden hover:bg-[#395788] w-80 transition-colors"
              onClick={logout}
            >
              <FaPowerOff />
              {translations.dashboard_logout}
            </Button>
          </div>

          {/* WhatsApp button */}
          <WhatsApp />

          {/* Mobile menu toggle */}
          <div className="absolute left-0 text-2xl z-50 right-0 p-8 md:hidden block">
            <button
              onClick={toggleAside}
              className="hover:text-[#a32054] transition-colors"
            >
              {isAsideOpen ? <FaX /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
