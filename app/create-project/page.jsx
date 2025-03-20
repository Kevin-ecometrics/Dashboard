/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import useTranslation from "../components/translation";
import {
  Select,
  Button,
  SelectItem,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { toast, Toaster } from "react-hot-toast";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import api_URL from "../utils/api";

export default function CreateProject() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(1);
  const [locale, setLocale] = useState("en"); // idioma por defecto
  const translations = useTranslation(locale);
  const handleChangeLanguage = (lang) => {
    setLocale(lang);
  };
  const handleOptionChange = (option) => {
    setSelected(option);
  };

  const percentages = [
    "0",
    "10",
    "20",
    "30",
    "40",
    "50",
    "60",
    "70",
    "80",
    "90",
    "100",
  ];
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [data, setData] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [trigger, setTrigger] = useState(0); // Nuevo estado para disparar useEffect

  useEffect(() => {
    const fetchTableData = async () => {
      if (selectedContent) {
        try {
          const response = await axios.get(
            `${api_URL}/api/${selectedContent.table}/${selectedContent.project.id}`
          );
          console.log("Data:", response.data); // Verifica la estructura de los datos
          setData(response.data);
        } catch (error) {
          console.error(
            `Error getting data from ${selectedContent.table}:`,
            error
          );
        }
      }
    };
    fetchTableData();
  }, [selectedContent]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${api_URL}/api/user`, {
          withCredentials: true,
        });
        if (res.data.user) {
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
  }, []);

  const initialState = {
    id_user: "",
    title: "",
    percentage: "",
    content: "",
    project_name: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckData = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${api_URL}/projects/${selectedProject.id}`,
        selectedProject
      );

      if (response.status === 200) {
        toast.success("Proyecto actualizado exitosamente", { duration: 3000 }); // Mostrar notificación de éxito
      } else {
        toast.success("Error al actualizar el proyecto", {
          duration: 3000,
        }); // Mostrar notificación de éxito
      }
    } catch (error) {
      console.error("Error al actualizar el contenido", error);
      toast.success("Error al actualizar el proyecto", {
        duration: 3000,
      }); // Mostrar notificación de éxito
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.id_user ||
      !formData.title ||
      !formData.percentage ||
      !formData.content ||
      !formData.project_name
    ) {
      toast.error("Por favor, complete todos los campos", { duration: 3000 });
      return;
    }

    try {
      const response = await fetch(`${api_URL}/create/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el proyecto");
      }
      toast.success("Proyecto creado exitosamente", {
        duration: 3000,
      }); // Mostrar notificación de éxito
      const data = await response.json();
      console.log("Proyecto creado exitosamente", data);
      setFormData(initialState); // Limpia los campos del formulario
    } catch (error) {
      toast.error("Error al crear el proyect", {
        duration: 3000,
      }); // Mostrar notificación de error
      console.error("Error en la creación del proyecto", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${api_URL}/get/projects`);
        setProjects(response.data);
        // console.log('Proyectos:', response.data)
      } catch (error) {
        console.error("Error en la creación del proyecto", error);
      }
    };

    fetchProjects();
  }, [trigger]);

  useEffect(() => {
    const fetchNameUser = async () => {
      try {
        const response = await axios.get(`${api_URL}/get/users`);
        setUsers(response.data);
        // console.log(response.data) // Aquí están los datos que devuelve tu API
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchNameUser();
  }, []);

  const content = {
    id_user: "",
    content_1: "",
    content_2: "",
    content_3: "",
    link: "",
    href: "",
    image: "",
    project_id: "",
    table: "",
  };

  const [formValues, setFormValues] = useState(content);

  const handleFormChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setFormValues({
      ...formValues,
      imageFile: event.target.files[0], // Guardar el archivo seleccionado en el estado
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("imageFile", formValues.imageFile); // Agregar el archivo al FormData

      // Agregar otros datos del formulario al FormData
      Object.keys(formValues).forEach((key) => {
        if (key !== "imageFile") {
          formData.append(key, formValues[key]);
        }
      });
      const response = await axios.post(
        `${api_URL}/create/content/${formValues.table}`,
        formValues,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Respuesta:", response.data);
      toast.success("Contenido creado exitosamente", {
        duration: 3000,
      }); // Mostrar notificación de éxito
    } catch (error) {
      console.error("Error en la creación del contenido", error);
      toast.error("Error al crear el contenido", {
        duration: 3000,
      }); // Mostrar notificación de error
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const table = selectedContent.table;
    const dataInfo = data[currentIndex];

    const formData = new FormData();
    formData.append("data", JSON.stringify(dataInfo)); // Añadir datos como JSON
    if (formValues.imageFile) {
      formData.append("imageFile", formValues.imageFile);
    }

    try {
      const response = await axios.put(`${api_URL}/update/${table}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Contenido actualizado exitosamente", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error en la actualización del contenido", error);
      toast.error("Error al actualizar el contenido", {
        duration: 3000,
      });
    }
  };

  const handleDeleteClick = async () => {
    const table = selectedContent.table;
    const dataInfo = data[currentIndex];
    // console.log("table:", table);
    // console.log("Datos a guardar:", dataInfo);

    try {
      const response = await axios.delete(
        `${api_URL}/delete/${table}/${dataInfo.id}`
      );
      console.log("Respuesta:", response.data);
      setData([]);
    } catch (error) {
      console.error("Error en la creación del proyecto", error);
    }
  };

  const [currentPage1, setCurrentPage1] = useState(0);
  const itemsPerPage1 = 3;

  const displayedProjects1 = projects.slice(
    currentPage1 * itemsPerPage1,
    (currentPage1 + 1) * itemsPerPage1
  );

  const totalPages1 = Math.ceil(projects.length / itemsPerPage1);

  const [currentPage2, setCurrentPage2] = useState(0);
  const itemsPerPage2 = 4;

  const displayedProjects2 = projects.slice(
    currentPage2 * itemsPerPage2,
    (currentPage2 + 1) * itemsPerPage2
  );

  const totalPages2 = Math.ceil(projects.length / itemsPerPage2);

  async function deleteProject(id) {
    const confirmDelete = window.confirm(
      "{translations.createProject_confirmDelete}"
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(`${api_URL}/project/delete/${id}`);

        setTrigger(trigger + 1); // Incrementa trigger para disparar useEffect

        console.log(response.data.message);

        // Aquí puedes hacer algo después de que el proyecto se haya eliminado con éxito, como actualizar la lista de proyectos
      } catch (error) {
        console.error("Error en la creación del proyecto", error);
      }
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-700">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <div className="flex items-center justify-center text-4xl text-blue-400 border-8 border-gray-300 rounded-full w-28 h-28 animate-spin border-t-blue-400">
            <Image alt="loading" src="/logo.png" width={100} height={100} />
          </div>
          <div className="mt-4 text-2xl text-white">
            {translations.project_loading}
          </div>
        </div>
      </div>
    );
  }

  if (user.rol !== "admin") {
    router.push("/not-found");
    return null;
  }

  return (
    <main className="flex">
      <aside className="hidden sm:block w-72 bg-[#21233A] overflow-auto py-4">
        <Avatar src="/logo_nav.jpg" className="h-24 w-24 mx-auto mb-4" />
        <hr className="mb-4" />
        <ul className="flex justify-center items-center flex-col cursor-pointer">
          <li
            className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl"
            onClick={() => handleOptionChange(1)}
          >
            {translations.createProject_createProject}
          </li>
          <li
            className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl"
            onClick={() => handleOptionChange(2)}
          >
            {translations.createProject_createContent}
          </li>
          <li
            className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl"
            onClick={() => handleOptionChange(3)}
          >
            {translations.createProject_updateProject}
          </li>
          <li
            className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl"
            onClick={() => handleOptionChange(4)}
          >
            {translations.createProject_updateContent}
          </li>
          <Link href="/dashboard">
            <li className="cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl">
              {translations.createProject_returnToDashboard}
            </li>
          </Link>
        </ul>
      </aside>
      <div className="flex flex-col px-12 h-[1200px] bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900 text-white flex-grow">
        {selected === 1 && (
          <div className="w-[700px] mx-auto py-8">
            <h1 className="py-4 text-2xl">
              {translations.createProject_createCardProject}
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-4 md:flex-nowrap"
            >
              <div className="flex flex-col gap-4">
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_title} // Aquí se corrige
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_content}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                />
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_projectName}
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row justify-between gap-4">
                <Select
                  label={translations.createProject_selectUser}
                  className="max-w-md text-black"
                  value={formData.id_user}
                  onChange={(e) =>
                    setFormData({ ...formData, id_user: e.target.value })
                  }
                >
                  {users.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="text-black"
                    >
                      {user.username}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label={translations.createProject_selectPercentage}
                  className="max-w-md text-black"
                  value={formData.percentage}
                  onChange={(e) =>
                    setFormData({ ...formData, percentage: e.target.value })
                  }
                >
                  {percentages.map((value) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-black"
                    >
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Button
                color="primary"
                className="px-12 hover:bg-blue-800"
                type="submit"
              >
                {translations.createProject_createProject}
              </Button>
            </form>
            {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
          </div>
        )}
        {selected === 2 && (
          <div className="w-[700px] mx-auto py-8">
            <h1 className="py-4 text-2xl">
              {translations.createProject_createContent}
            </h1>
            <form
              onSubmit={handleFormSubmit}
              encType="multipart/form-data"
              className="flex flex-col w-full gap-4 md:flex-nowrap"
            >
              <div className="flex flex-col gap-4">
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_title}
                  name="content_1"
                  value={formValues.content_1}
                  onChange={handleFormChange}
                />
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_description}
                  name="content_2"
                  value={formValues.content_2}
                  onChange={handleFormChange}
                />
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_content}
                  name="content_3"
                  value={formValues.content_3}
                  onChange={handleFormChange}
                />
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_linkName}
                  name="link"
                  value={formValues.link}
                  onChange={handleFormChange}
                />
                <Input
                  className="text-black"
                  type="text"
                  label={translations.createProject_href}
                  name="href"
                  value={formValues.href}
                  onChange={handleFormChange}
                />
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-row justify-between gap-4">
                <Select
                  label={translations.createProject_selectClient}
                  className="max-w-md text-black"
                  value={formValues.id_user}
                  onChange={(e) =>
                    setFormValues({ ...formValues, id_user: e.target.value })
                  }
                >
                  {users.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="text-black"
                    >
                      {user.username}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label={translations.createProject_selectProject}
                  className="max-w-md text-black"
                  value={formValues.project_id}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      project_id: e.target.value,
                    })
                  }
                >
                  {projects &&
                    projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id}
                        className="text-black"
                      >
                        {project.title}
                      </SelectItem>
                    ))}
                </Select>
                <Select
                  label={translations.createProject_selectPhase}
                  className="max-w-md text-black"
                  value={formValues.table}
                  onChange={(e) =>
                    setFormValues({ ...formValues, table: e.target.value })
                  }
                >
                  <SelectItem
                    className="text-black"
                    key="business_and_client_objectives"
                    value="business_and_client_objectives"
                  >
                    {translations.project_nameOfBusinessAndClientObjectives}
                  </SelectItem>
                  <SelectItem
                    className="text-black"
                    key="onboarding_package"
                    value="onboarding_package"
                  >
                    {translations.project_onboardingPackage}
                  </SelectItem>
                  <SelectItem
                    className="text-black"
                    key="mvp_and_idea"
                    value="mvp_and_idea"
                  >
                    {translations.project_mvpAndIdea}
                  </SelectItem>
                  <SelectItem
                    className="text-black"
                    key="strategy"
                    value="strategy"
                  >
                    {translations.project_strategy}
                  </SelectItem>
                  <SelectItem
                    className="text-black"
                    key="growth_hacking"
                    value="growth_hacking"
                  >
                    {translations.project_growthHacking}
                  </SelectItem>
                </Select>
              </div>
              <Button
                color="primary"
                className="px-12 hover:bg-blue-800"
                type="submit"
              >
                {translations.createProject_createContent}
              </Button>
            </form>
          </div>
        )}
        {selected === 3 && (
          <div>
            <h1 className="p-8 text-2xl text-center">
              {translations.createProject_updateClientProjects}
            </h1>
            <Table
              className="text-black"
              aria-label="Example static collection table"
            >
              <TableHeader>
                <TableColumn className="text-black">
                  {translations.createProject_id}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_title}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_action}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_delte}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {displayedProjects1.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        className="hover:bg-blue-700"
                        onClick={() => setSelectedProject(project)}
                      >
                        Actions
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        className="hover:bg-red-700"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <nav className="flex justify-end items-center gap-4 py-4">
              {Array.from({ length: totalPages1 }, (_, index) => (
                <button
                  className={`rounded-xl px-4 py-2 ${
                    currentPage1 === index
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                  key={index}
                  onClick={() => setCurrentPage1(index)}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
            {selectedProject && (
              <div className="flex flex-col items-center justify-center">
                <form onSubmit={handleCheckData}>
                  <div className="[&>label]:px-4 [&>label]:py-2 py-4">
                    <div className="grid grid-cols-4 gap-8">
                      {/* <label htmlFor="projectId">Project ID:</label>

                    <input
                      className="p-4 text-black rounded-2xl"
                      id="projectId"
                      type="text"
                      value={selectedProject.id}
                      readOnly
                    /> */}
                      <label htmlFor="id_user">
                        {translations.panel_userName}:
                      </label>
                      <select
                        className="p-4 text-black rounded-2xl"
                        id="id_user"
                        value={selectedProject.id_user}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            id_user: e.target.value,
                          })
                        }
                      >
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="title">
                        {translations.createProject_title}:
                      </label>
                      <input
                        className="p-4 text-black rounded-2xl"
                        id="title"
                        type="text"
                        value={selectedProject.title}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            title: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="project_name">
                        {translations.createProject_projectName}:
                      </label>
                      <input
                        className="p-4 text-black rounded-2xl"
                        id="project_name"
                        type="text"
                        value={selectedProject.project_name}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            project_name: e.target.value,
                          })
                        }
                      />
                      <label htmlFor="percentage">
                        {translations.createProject_Percentage}:
                      </label>
                      <input
                        className="p-4 text-black rounded-2xl"
                        id="percentage"
                        type="text"
                        value={selectedProject.percentage}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            percentage: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center py-4 ">
                      <label htmlFor="content">
                        {translations.createProject_content}:
                      </label>
                      <textarea
                        className="px-4 text-black rounded-2xl"
                        id="content"
                        type="text"
                        rows="8"
                        cols="40"
                        value={selectedProject.content}
                        onChange={(e) =>
                          setSelectedProject({
                            ...selectedProject,
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <Button
                      type="submit"
                      className="text-white bg-blue-500 hover:bg-blue-700"
                    >
                      {translations.createProject_updateProject}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        {selected === 4 && (
          <div>
            {" "}
            <h1 className="p-8 text-2xl text-center">
              {translations.createProject_updateCardContent}
            </h1>
            <Table
              className="text-black"
              aria-label="Example static collection table"
            >
              <TableHeader>
                <TableColumn className="text-black">
                  {translations.createProject_id}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_title}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_businessAndClientObjectives}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_onboardingPackage}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_mvpAndIdea}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_strateg}
                </TableColumn>
                <TableColumn className="text-black">
                  {translations.createProject_growthHacking}
                </TableColumn>
              </TableHeader>
              <TableBody>
                {displayedProjects2.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.title}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        className="hover:bg-blue-700"
                        onClick={() =>
                          setSelectedContent({
                            project: project,
                            table: "business_and_client_objectives",
                          })
                        }
                      >
                        {translations.createProject_business}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        className="hover:bg-blue-700"
                        onClick={() =>
                          setSelectedContent({
                            project: project,
                            table: "onboarding_package",
                          })
                        }
                      >
                        {translations.createProject_onboarding}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        className="hover:bg-blue-700"
                        onClick={() =>
                          setSelectedContent({
                            project: project,
                            table: "mvp_and_idea",
                          })
                        }
                      >
                        {translations.createProject_mvp}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        className="hover:bg-blue-700"
                        onClick={() =>
                          setSelectedContent({
                            project: project,
                            table: "strategy",
                          })
                        }
                      >
                        {translations.createProject_strategy}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        className="hover:bg-blue-700"
                        onClick={() =>
                          setSelectedContent({
                            project: project,
                            table: "growth_hacking",
                          })
                        }
                      >
                        {translations.createProject_growthHacking}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <nav className="flex justify-end items-center gap-4 py-4">
              {Array.from({ length: totalPages2 }, (_, index) => (
                <button
                  className={`rounded-xl px-4 py-2 ${
                    currentPage2 === index
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black"
                  }`}
                  key={index}
                  onClick={() => setCurrentPage2(index)}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
            {data.length > 0 &&
              data.map(
                (content, index) =>
                  index === currentIndex && (
                    <form key={index} onSubmit={handleSaveChanges}>
                      <div className="grid grid-cols-3 gap-4 py-8">
                        <Input
                          label={translations.createProject_title}
                          type="text"
                          className="text-black rounded-2xl"
                          value={content.content_1 || ""}
                          onChange={(e) => {
                            setData(
                              data.map((item, i) => {
                                if (i === currentIndex) {
                                  item.content_1 = e.target.value;
                                }
                                return item;
                              })
                            );
                          }}
                        />
                        <Input
                          label={translations.createProject_description}
                          type="text"
                          className="text-black rounded-2xl"
                          value={content.content_2 || ""}
                          onChange={(e) => {
                            setData(
                              data.map((item, i) => {
                                if (i === currentIndex) {
                                  item.content_2 = e.target.value;
                                }
                                return item;
                              })
                            );
                          }}
                        />
                        <Input
                          label={translations.createProject_content}
                          type="text"
                          className="text-black rounded-2xl"
                          value={content.content_3 || ""}
                          onChange={(e) => {
                            setData(
                              data.map((item, i) => {
                                if (i === currentIndex) {
                                  item.content_3 = e.target.value;
                                }
                                return item;
                              })
                            );
                          }}
                        />
                        <Input
                          label={translations.createProject_href}
                          type="text"
                          className="text-black rounded-2xl"
                          value={content.href || ""}
                          onChange={(e) => {
                            setData(
                              data.map((item, i) => {
                                if (i === currentIndex) {
                                  item.href = e.target.value;
                                }
                                return item;
                              })
                            );
                          }}
                        />
                        <Input
                          label={translations.createProject_linkName}
                          type="text"
                          className="text-black rounded-2xl"
                          value={content.link || ""}
                          onChange={(e) => {
                            setData(
                              data.map((item, i) => {
                                if (i === currentIndex) {
                                  item.link = e.target.value;
                                }
                                return item;
                              })
                            );
                          }}
                        />

                        {data.length > 0 && (
                          <div>
                            <div className="mb-8">
                              <input
                                type="file"
                                name="imageFile"
                                onChange={handleFileChange}
                              />
                            </div>
                            <div>
                              {data[currentIndex] &&
                                data[currentIndex].source && (
                                  <img
                                    className="w-80 h-80"
                                    src={`data:image/jpeg;base64,${Buffer.from(
                                      data[currentIndex].source
                                    ).toString("base64")}`}
                                    alt="Current Project"
                                  />
                                )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-4">
                        <button
                          className="p-4 text-white bg-blue-500 rounded-2xl hover:bg-blue-700"
                          type="submit"
                        >
                          {translations.createProject_updateContent}
                        </button>
                        <button
                          className="p-4 text-white bg-red-500 rounded-2xl hover:bg-red-700"
                          onClick={handleDeleteClick}
                        >
                          {translations.createProject_deleteContent}
                        </button>
                      </div>
                    </form>
                  )
              )}
            {data.length > 1 && (
              <div className="flex justify-start gap-4 py-4">
                {Array.from({ length: data.length }, (_, i) => i).map(
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`p-5 ${
                        currentIndex === index ? "bg-blue-700" : "bg-blue-500"
                      } hover:bg-blue-700 rounded-2xl`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}

        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </main>
  );
}
