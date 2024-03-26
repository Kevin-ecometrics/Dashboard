"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { usePathname } from "next/navigation";
import { Button, Link, Avatar, Divider } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  FaCheck,
  FaXmark,
  FaPowerOff,
  FaBars,
  FaComments,
  FaWhatsapp,
} from "react-icons/fa6";
import Image from "next/image";

function Dashboard() {
  let avatarURl;
  const [titleProject, setTitleProject] = useState("");
  const [timeout, setTimeoutState] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutState(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const isDev = process.env.NEXT_PUBLIC_IS_DEV;
  const baseURL = isDev
    ? "http://localhost:3001/"
    : "https://e-commetrics.com/";
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(0); // Estado para el elemento seleccionado
  const pathname = usePathname();
  const parts = pathname.split("/"); // Esto devuelve ["", "dashboard", "project1"]
  const projectName = parts[2]; // Esto selecciona "project1"
  const [projectInformation, setProjectInformation] = useState(null); // Añade esta línea

  useEffect(() => {
    const fetchProjectInformation = async () => {
      if (projectName) {
        try {
          const res1 = await axios.get(
            `https://e-commetrics.com/api/businessAndClientObjectives?projectName=${projectName}`
          );
          const res2 = await axios.get(
            `https://e-commetrics.com/api/onboardingPackage?projectName=${projectName}`
          );
          const res3 = await axios.get(
            `https://e-commetrics.com/api/mvpAndIdea?projectName=${projectName}`
          );
          const res4 = await axios.get(
            `https://e-commetrics.com/api/naStrategyGrowthhacking?projectName=${projectName}`
          );
          setProjectInformation({
            bco: res1.data,
            op: res2.data,
            mvp: res3.data,
            strat: res4.data,
          }); // Guarda las respuestas de la API en el estado
          console.log(
            "Información del proyecto:",
            res1.data,
            res2.data,
            res3.data,
            res4.data
          );
        } catch (error) {
          console.error("Error al obtener la información del proyecto:", error);
        }
      }
    };

    fetchProjectInformation();
  }, []); // Dependencia vacía para que se ejecute el useEffect sólo una vez

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://e-commetrics.com/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        router.push("/not-found");
      }
    };

    fetchUser();
  }, []); // Dependencia vacía para que se ejecute el useEffect sólo una vez

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `https://e-commetrics.com/api/projects?userId=` + user.id,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setTitleProject(data[0].title);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []); // Dependencia vacía para que se ejecute el useEffect sólo una vez

  const logout = async () => {
    try {
      await axios.post(
        `https://e-commetrics.com/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-700">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <div className="flex items-center justify-center text-4xl text-blue-400 border-8 border-gray-300 rounded-full w-28 h-28 animate-spin border-t-blue-400">
            <Image alt="loading" src="/logo.png" width={100} height={100} />
          </div>
          <div className="mt-4 text-2xl text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (user.email === "admin@e-commetrics.com") {
    avatarURl = "/logo_nav.jpg"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "mydentist@reformadental.com") {
    avatarURl = "/reforma logo.png"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "syl@gmail.com") {
    avatarURl = "/SYL logo.jpeg"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "draanyimanchola@bitescreadoresdesonrisas.com") {
    avatarURl = "/bites logo.png"; // Reemplaza esto con la ruta a la imagen del usuario
  } else {
    avatarURl = ""; // Reemplaza esto con la ruta a la imagen del usuario por defecto
  }

  return (
    <section className="text-white">
      <div className="flex bg-[#21233A]">
        <aside className="hidden h-screen px-8 py-12 sm:block md:w-1/5">
          <div className="flex flex-col items-center gap-4">
            <Avatar src={avatarURl} className="h-24 w-24" />
            <h1 className="flex items-center justify-start text-2xl animate-jump-in">
              {user.rol === "usuario" ? titleProject : "Admin"}
            </h1>
          </div>
          <Divider className="my-4 bg-white" />
          <div className="relative py-8">
            <ul>
              <li className="flex flex-col gap-y-4">
                <span
                  className={`flex items-center gap-4 ${
                    selectedItem === 0 ? "selected text-pink-500" : ""
                  }`}
                  onClick={() => setSelectedItem(0)}
                >
                  <FaBars />
                  <span>ALL CONTENT</span>
                </span>
                <span
                  className={`flex items-center gap-4 ${
                    selectedItem === 1 ? "selected text-pink-500" : ""
                  }`}
                  onClick={() => setSelectedItem(1)}
                >
                  <FaBars /> <span>Name of BUSINESS and Client objectives</span>
                </span>
                <span
                  className={`flex items-center gap-4 ${
                    selectedItem === 2 ? "selected text-pink-500" : ""
                  }`}
                  onClick={() => setSelectedItem(2)}
                >
                  <FaBars />
                  <span> Onboarding Package</span>
                </span>
                <span
                  className={`flex items-center gap-4 ${
                    selectedItem === 3 ? "selected text-pink-500" : ""
                  }`}
                  onClick={() => setSelectedItem(3)}
                >
                  <FaBars />
                  <span> MVP + IDEA</span>
                </span>
                <span
                  className={`flex items-center gap-4 ${
                    selectedItem === 4 ? "selected text-pink-500" : ""
                  }`}
                  onClick={() => setSelectedItem(4)}
                >
                  <FaBars />
                  <span>N/A Strategy + GrowthHacking</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Button
              className="text-white bg-blue-500 w-96 hover:bg-blue-700"
              onClick={logout}
            >
              <FaPowerOff className="mr-2" />
              LOG OUT
            </Button>
          </div>
        </aside>
        <div className="flex flex-col px-12 py-4 w-screen md:w-4/5 bg-[#151A28]">
          <div
            className={
              selectedItem === 0
                ? "px-6 w-auto  md:w-3/4 py-4"
                : "px-6 w-auto md:w-[450px] py-4"
            }
            style={{
              backgroundImage: selectedItem > 0 ? `url('/card.png')` : "none", // Reemplaza esto con la ruta a tu imagen
              backgroundSize: "cover", // Esto hace que la imagen cubra todo el div
              backgroundRepeat: "no-repeat", // Esto evita que la imagen se repita
            }}
          >
            <h1
              className={
                selectedItem === 0
                  ? "text-start text-3xl"
                  : "text-center text-3xl"
              }
            >
              {selectedItem === 0
                ? "All content"
                : selectedItem === 1
                ? "Name of BUSINESS and Client objectives"
                : selectedItem === 2
                ? "Onboarding Package"
                : selectedItem === 3
                ? "MVP + IDEA"
                : selectedItem === 4
                ? "N/A Strategy + GrowthHacking"
                : ""}
            </h1>{" "}
            {selectedItem === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectInformation &&
                  projectInformation.bco &&
                  projectInformation.bco.length > 0 &&
                  projectInformation.bco.map((project, index) => (
                    <div
                      key={index}
                      className="w-full animate-fade-left animate-once animate-delay-200"
                    >
                      <div className="py-4">
                        <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                          {" "}
                          <div className="mb-4">
                            <span className="text-lg font-bold ">
                              {project.content_1}
                            </span>
                          </div>
                          <div className="mb-4">
                            <span className="text-base">
                              {project.content_2}
                            </span>
                          </div>
                          {project.content_3 && (
                            <div className="mb-4">
                              <p className="text-base">{project.content_3}</p>
                            </div>
                          )}
                          {project.image && (
                            <div className="mb-4">
                              <img src={project.image} alt="Project" />
                            </div>
                          )}
                          <Link
                            target="_blank"
                            className="text-blue-500 underline"
                            href={project.href}
                          >
                            {project.link}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                {projectInformation &&
                  projectInformation.op &&
                  projectInformation.op.length > 0 &&
                  projectInformation.op.map((project, index) => (
                    <div
                      key={index}
                      className="w-full animate-fade-left animate-once animate-delay-200"
                    >
                      <div className="py-4">
                        <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                          {" "}
                          <div className="mb-4">
                            <span className="text-lg font-bold ">
                              {project.content_1}
                            </span>
                          </div>
                          <div className="mb-4">
                            <span className="text-base">
                              {project.content_2}
                            </span>
                          </div>
                          {project.content_3 && (
                            <div className="mb-4">
                              <p className="text-base">{project.content_3}</p>
                            </div>
                          )}
                          {project.image && (
                            <div className="mb-4">
                              <img src={project.image} alt="Project" />
                            </div>
                          )}
                          <Link
                            target="_blank"
                            className="text-blue-500 underline"
                            href={project.href}
                          >
                            {project.link}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                {projectInformation &&
                  projectInformation.mvp &&
                  projectInformation.mvp.length > 0 &&
                  projectInformation.mvp.map((project, index) => (
                    <div
                      key={index}
                      className="w-full animate-fade-left animate-once animate-delay-200"
                    >
                      <div className="py-4">
                        <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                          {" "}
                          <div className="mb-4">
                            <span className="text-lg font-bold ">
                              {project.content_1}
                            </span>
                          </div>
                          <div className="mb-4">
                            <span className="text-base">
                              {project.content_2}
                            </span>
                          </div>
                          {project.content_3 && (
                            <div className="mb-4">
                              <p className="text-base">{project.content_3}</p>
                            </div>
                          )}
                          {project.image && (
                            <div className="mb-4">
                              <img src={project.image} alt="Project" />
                            </div>
                          )}
                          <Link
                            target="_blank"
                            className="text-blue-500 underline"
                            href={project.href}
                          >
                            {project.link}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                {projectInformation &&
                  projectInformation.strat &&
                  projectInformation.strat.length > 0 &&
                  projectInformation.strat.map((project, index) => (
                    <div
                      key={index}
                      className="w-full animate-fade-left animate-once animate-delay-200"
                    >
                      <div className="py-4">
                        <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                          {" "}
                          <div className="mb-4">
                            <span className="text-lg font-bold ">
                              {project.content_1}
                            </span>
                          </div>
                          <div className="mb-4">
                            <span className="text-base">
                              {project.content_2}
                            </span>
                          </div>
                          {project.content_3 && (
                            <div className="mb-4">
                              <p className="text-base">{project.content_3}</p>
                            </div>
                          )}
                          {project.image && (
                            <div className="mb-4">
                              <img src={project.image} alt="Project" />
                            </div>
                          )}
                          <Link
                            target="_blank"
                            className="text-blue-500 underline"
                            href={project.href}
                          >
                            {project.link}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : selectedItem === 1 &&
              projectInformation &&
              projectInformation.bco &&
              projectInformation.bco.length > 0 ? (
              projectInformation.bco.map((project, index) => (
                <div
                  key={index}
                  className="w-full md:w-[400px] animate-fade-left animate-once animate-delay-200"
                >
                  <div className="p-4">
                    <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                      {" "}
                      <div className="mb-4">
                        <span className="text-lg font-bold ">
                          {project.content_1}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base">{project.content_2}</span>
                      </div>
                      {project.content_3 && (
                        <div className="mb-4">
                          <p className="text-base">{project.content_3}</p>
                        </div>
                      )}
                      {project.image && (
                        <div className="mb-4">
                          <img src={project.image} alt="Project" />
                        </div>
                      )}
                      <Link
                        target="_blank"
                        className="text-blue-500 underline"
                        href={project.href}
                      >
                        {project.link}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : selectedItem === 2 &&
              projectInformation &&
              projectInformation.op &&
              projectInformation.op.length > 0 ? (
              projectInformation.op.map((project, index) => (
                <div
                  key={index}
                  className="w-full md:w-[400px] rounded-xl animate-fade-left animate-once animate-delay-200"
                >
                  <div className="p-4 rounded-3xl">
                    <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                      {" "}
                      <div className="mb-4">
                        <span className="text-lg font-bold ">
                          {project.content_1}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base">{project.content_2}</span>
                      </div>
                      {project.content_3 && (
                        <div className="mb-4">
                          <p className="text-base">{project.content_3}</p>
                        </div>
                      )}
                      {project.image && (
                        <div className="mb-4">
                          <img src={project.image} alt="Project" />
                        </div>
                      )}
                      <Link
                        target="_blank"
                        className="text-blue-500 underline"
                        href={project.href}
                      >
                        {project.link}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : selectedItem === 3 &&
              projectInformation &&
              projectInformation.mvp &&
              projectInformation.mvp.length > 0 ? (
              projectInformation.mvp.map((project, index) => (
                <div
                  key={index}
                  className="w-full md:w-[400px] rounded-xl animate-fade-left animate-once animate-delay-200"
                >
                  <div className="p-4 rounded-3xl">
                    <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                      {" "}
                      <div className="mb-4">
                        <span className="text-lg font-bold ">
                          {project.content_1}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base">{project.content_2}</span>
                      </div>
                      {project.content_3 && (
                        <div className="mb-4">
                          <p className="text-base">{project.content_3}</p>
                        </div>
                      )}
                      {project.image && (
                        <div className="mb-4">
                          <img src={project.image} alt="Project" />
                        </div>
                      )}
                      <Link
                        target="_blank"
                        className="text-blue-500 underline"
                        href={project.href}
                      >
                        {project.link}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : selectedItem === 4 &&
              projectInformation &&
              projectInformation.strat &&
              projectInformation.strat.length > 0 ? (
              projectInformation.strat.map((project, index) => (
                <div
                  key={index}
                  className="w-full md:w-[400px] rounded-xl animate-fade-left animate-once animate-delay-200"
                >
                  <div className="p-4 rounded-3xl">
                    <div className="bg-[#191c33] shadow-md rounded-2xl p-6">
                      {" "}
                      <div className="mb-4">
                        <span className="text-lg font-bold ">
                          {project.content_1}
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-base">{project.content_2}</span>
                      </div>
                      {project.content_3 && (
                        <div className="mb-4">
                          <p className="text-base">{project.content_3}</p>
                        </div>
                      )}
                      {project.image && (
                        <div className="mb-4">
                          <img src={project.image} alt="Project" />
                        </div>
                      )}
                      <Link
                        target="_blank"
                        className="text-blue-500 underline"
                        href={project.href}
                      >
                        {project.link}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : timeout ? (
              <div className="flex items-center justify-center h-screen text-2xl">
                No hay información por mostrar.
              </div>
            ) : (
              <div className="flex items-center justify-center h-screen">
                <div class="flex-col gap-4 w-full flex items-center justify-center">
                  <div class="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
                    <Image
                      src="/logo.png"
                      width={100}
                      height={100}
                      alt="logo"
                    />
                  </div>
                  <div className="mt-4 text-2xl text-white">Loading...</div>{" "}
                </div>{" "}
              </div>
            )}
            <div className="flex items-center justify-center">
              <Button
                className="block text-white bg-blue-500 sm:hidden hover:bg-blue-700 w-80"
                onClick={logout}
              >
                LOG OUT
              </Button>
            </div>
          </div>
          <section className="flex flex-col justify-between my-6 sm:flex-row">
            <div className="hidden md:block ">
              {" "}
              <h1 className="text-center text-3xl justify-center items-center rounded-2xl w-[600px] mt-8 py-12 bg-[#21233A]">
                Comercial
              </h1>
            </div>
            <div className="flex justify-center items-center px-24">
              <FaComments className="w-12 h-24" />
              <FaWhatsapp className="text-green-500 h-12 w-24" />
            </div>
          </section>
        </div>
      </div>
      <footer>
        <div className="flex items-center justify-center py-4 text-white border-t bg-[#21233A]">
          © 2023 All rights reserved
        </div>
      </footer>
    </section>
  );
}

export default Dashboard;
