"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaCheck,
  FaXmark,
  FaPowerOff,
  FaHouse,
  FaPlus,
  FaUsers,
  FaComments,
  FaWhatsapp,
} from "react-icons/fa6";
import {
  Progress,
  Button,
  Link,
  Avatar,
  Accordion,
  AccordionItem,
  Divider,
  Chip,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { titillium, montse } from "../fonts";
function Dashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleButtonClick = (index) => {
    setCurrentIndex(index * 3);
  };

  const [user, setUser] = useState(null);
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const numberOfButtons = Math.ceil(projects.length / 3);

  let avatarURl;

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
          const resProjects = await axios.get(
            `http://localhost:3001/api/projects?userId=${res.data.user.id}`,
            { withCredentials: true }
          );
          if (resProjects && resProjects.data) {
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
      await axios.post(
        `http://localhost:3001/logout`,

        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const getColor = (value) => {
    if (value >= 0 && value <= 35) {
      return "danger";
    } else if (value > 35 && value <= 70) {
      return "warning";
    } else if (value > 70 && value <= 99) {
      return "primary";
    } else if (value == 100) {
      return "success";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <div className="flex items-center justify-center text-4xl text-blue-400 border-8 border-gray-300 rounded-full w-28 h-28 animate-spin border-t-blue-400">
            <Image alt="loading" src="/logo.png" width={100} height={100} />
          </div>
          <div className="mt-4 text-2xl text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (user.email === "juanmanuel@e-commetrics.com") {
    avatarURl = "/logo_nav.jpg"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "mydentist@reformadental.com") {
    avatarURl = "/reforma logo.png"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "syl@gmail.com") {
    avatarURl = "/SYL logo.jpeg"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "draanyimanchola@bitescreadoresdesonrisas.com") {
    avatarURl = "/bites logo.png"; // Reemplaza esto con la ruta a la imagen del usuario
  } else {
    avatarURl = "/logo_nav.jpg"; // Reemplaza esto con la ruta a la imagen del usuario por defecto
  }

  return (
    <section className="h-screen w-screen text-white bg-[#21233A]">
      <div className="flex h-max bg-[#191c33]">
        <aside className="hidden h-screen px-8 py-12 w-36 sm:block md:w-1/5">
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
                title={<span style={{ color: "white" }}>Projects</span>}
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
                  indicator={({ isOpen }) =>
                    isOpen ? <FaXmark /> : <FaCheck />
                  }
                  title={
                    <span style={{ color: "white" }}>
                      Update Client Project
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
                            UPDATE CLIENT PROJECT
                          </span>
                        </div>
                      </li>
                    </ul>
                  </Link>
                </AccordionItem>
                <AccordionItem
                  key="5"
                  aria-label="Information"
                  indicator={({ isOpen }) =>
                    isOpen ? <FaXmark /> : <FaCheck />
                  }
                  title={<span style={{ color: "white" }}>Create Client</span>}
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
                            CREATE CLIENT
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
              LOG OUT
            </Button>
          </div>
        </aside>
        <div className="flex flex-col w-screen md:w-4/5 bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900">
          <div className="py-8 text-center text-white">
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Welcome to your dashboard",
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                "Ecommetrica",
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
                className="flex [&>div]:text-white [&>h2]:text-white [&>p]:text-white flex-col w-[300px] h-full rounded-2xl  shadow-2xl"
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
                      <Chip
                        startContent={<FaCheck size={18} />}
                        variant="faded"
                        color="primary"
                      >
                        {project.percentage === 100
                          ? "Project completed"
                          : "Project in progress"}
                      </Chip>
                    ) : (
                      <Button className="bg-[#a32054] hover:bg-[#395788]">
                        <Link
                          className="text-white"
                          href={`/dashboard/${project.project_name}`}
                        >
                          Go to proyect
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center md:justify-end py-4 items-center gap-4 md:w-[87%]">
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
              LOG OUT
            </Button>
          </div>
          <section className="flex flex-col justify-center px-2 items-center md:flex-row gap-16">
            <div className="hidden md:block">
              <h1 className="text-center text-3xl justify-center items-center rounded-2xl w-full md:w-[500px] lg:w-[750px] mt-8 mx-0 py-12 bg-transparent border-2">
                Comercial
              </h1>
            </div>
            <div className="flex justify-center items-center w-full md:w-auto px-4">
              <FaComments className="w-12 h-24" />
              <Link href="https://wa.me/+526646429633" target="_blank">
                <FaWhatsapp className="text-green-500 h-12 w-24" />
              </Link>{" "}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
