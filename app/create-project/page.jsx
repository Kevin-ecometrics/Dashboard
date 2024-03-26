"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  Select,
  Button,
  SelectItem,
  Input,
  Tabs,
  Tab,
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

export default function CreateProject() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    const fetchTableData = async () => {
      if (selectedContent) {
        try {
          const response = await axios.get(
            // `https://e-commetrics.com/api/${selectedContent.table}/${selectedContent.project.id}`
            `http://localhost:3001/api/${selectedContent.table}/${selectedContent.project.id}`
          );
          console.log(response.data); // Agrega esta línea para ver los datos en la consola
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
        // const res = await axios.get(`https://e-commetrics.com/api/user`, {
        const res = await axios.get(`http://localhost:3001/api/user`, {
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
        `http://localhost:3001/projects/${selectedProject.id}`,
        selectedProject
      );

      if (response.status === 200) {
        toast.success("Proyecto actualizado exitosamente", { duration: 3000 }); // Mostrar notificación de éxito
      } else {
        toast.success("Error al actualizar el proyecto", { duration: 3000 }); // Mostrar notificación de éxito
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.success("Error al actualizar el proyecto", { duration: 3000 }); // Mostrar notificación de éxito
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
      const response = await fetch(`http://localhost:3001/create/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el proyecto");
      }
      toast.success("Proyecto creado exitosamente", { duration: 3000 }); // Mostrar notificación de éxito
      const data = await response.json();
      console.log("Proyecto creado exitosamente:", data);
      setFormData(initialState); // Limpia los campos del formulario
    } catch (error) {
      toast.error("Error al crear el Proyecto", { duration: 3000 }); // Mostrar notificación de error
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/get/projects`);
        setProjects(response.data);
        // console.log('Proyectos:', response.data)
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchNameUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/get/users`);
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

    console.log(formValues);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3001/create/${formValues.table}`,
        formValues
      );
      console.log("Respuesta:", response.data);
      toast.success("Contenido creado exitosamente", { duration: 3000 }); // Mostrar notificación de éxito
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear el contenido", { duration: 3000 }); // Mostrar notificación de error
    }
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();

    const table = selectedContent.table;
    const dataInfo = data[currentIndex];
    // console.log('table:', table);
    // console.log('Datos a guardar:', dataInfo)

    try {
      const response = await axios.put(
        `http://localhost:3001/update/${table}`,
        dataInfo
      );
      toast.success("Contenido actualizado exitosamente", { duration: 3000 }); // Mostrar notificación de éxito
      // console.log("Respuesta:", response.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el contenido", { duration: 3000 }); // Mostrar notificación de error
    }
  };

  const handleDeleteClick = async () => {
    const table = selectedContent.table;
    const dataInfo = data[currentIndex];
    // console.log("table:", table);
    // console.log("Datos a guardar:", dataInfo);

    try {
      const response = await axios.delete(
        `http://localhost:3001/delete/${table}/${dataInfo.id}`
      );
      console.log("Respuesta:", response.data);
      setData([]);
    } catch (error) {
      console.error("Error:", error);
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

  if (user.rol !== "admin") {
    router.push("/not-found");
    return null;
  }

  return (
    <main className="flex">
      <aside className="hidden sm:block h-screen w-72 bg-[#21233A] overflow-auto py-4">
        <Avatar src="/logo_nav.jpg" className="h-24 w-24 mx-auto mb-4" />
        <hr className="mb-4" />
        <ul className="flex justify-center items-center flex-col">
          <Link href="/dashboard">
            <li className="cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl">
              Return to Dashboard
            </li>
          </Link>
        </ul>
      </aside>
      <div className="flex flex-col items-center justify-center h-screen bg-[#151A28] text-white flex-grow">
        <Tabs aria-label="Options" radius="full" color="primary">
          <Tab key="create-project" title="Create project">
            <div className="w-[700px]">
              <h1 className="py-4 text-2xl">Create Card Project</h1>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-4 md:flex-nowrap"
              >
                <div className="flex flex-col gap-4">
                  <Input
                    className="text-black"
                    type="text"
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Project Name"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row justify-between gap-4">
                  <Select
                    label="Select User"
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
                    label="Select Percentage"
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
                  Create Project
                </Button>
              </form>
              {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
            </div>
          </Tab>
          <Tab key="create-content" title="Create content">
            <div className="w-[700px]">
              <h1 className="py-4 text-2xl">Create Content</h1>
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col w-full gap-4 md:flex-nowrap"
              >
                <div className="flex flex-col gap-4">
                  <Input
                    className="text-black"
                    type="text"
                    label="Title"
                    name="content_1"
                    value={formValues.content_1}
                    onChange={handleFormChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Descripcion"
                    name="content_2"
                    value={formValues.content_2}
                    onChange={handleFormChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Content"
                    name="content_3"
                    value={formValues.content_3}
                    onChange={handleFormChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Link Name"
                    name="link"
                    value={formValues.link}
                    onChange={handleFormChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Href"
                    name="href"
                    value={formValues.href}
                    onChange={handleFormChange}
                  />
                  <Input
                    className="text-black"
                    type="text"
                    label="Preview Image"
                    name="image"
                    value={formValues.image}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="flex flex-row justify-between gap-4">
                  <Select
                    label="Select Client"
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
                    label="Select Project"
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
                    label="Select Phase"
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
                      Name of BUSINESS and Client objectives
                    </SelectItem>
                    <SelectItem
                      className="text-black"
                      key="onboarding_package"
                      value="onboarding_package"
                    >
                      Onboarding Package
                    </SelectItem>
                    <SelectItem
                      className="text-black"
                      key="mvp_and_idea"
                      value="mvp_and_idea"
                    >
                      MVP + IDEA
                    </SelectItem>
                    <SelectItem
                      className="text-black"
                      key="na_strategy_growthhacking"
                      value="na_strategy_growthhacking"
                    >
                      N/A Strategy + GrowthHacking
                    </SelectItem>
                  </Select>
                </div>
                <Button
                  color="primary"
                  className="px-12 hover:bg-blue-800"
                  type="submit"
                >
                  Create Content
                </Button>
              </form>
            </div>
          </Tab>
          <Tab key="update-project" title="Update project">
            <h1 className="p-8 text-2xl text-center">Update Client Projects</h1>
            <Table
              className="text-black"
              aria-label="Example static collection table"
            >
              <TableHeader>
                <TableColumn className="text-black">ID</TableColumn>
                <TableColumn className="text-black">Title</TableColumn>
                <TableColumn className="text-black">Action</TableColumn>
              </TableHeader>
              <TableBody>
                {projects &&
                  projects.map((project) => (
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
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {selectedProject && (
              <div className="flex flex-col items-center justify-center">
                <form onSubmit={handleCheckData}>
                  <div className="[&>label]:px-4 [&>label]:py-2 py-4">
                    <div className="grid grid-cols-4 gap-8">
                      <label htmlFor="projectId">Project ID:</label>
                      <input
                        className="p-4 text-black rounded-2xl"
                        id="projectId"
                        type="text"
                        value={selectedProject.id}
                        readOnly
                      />
                      <label htmlFor="title">Title:</label>
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
                      <label htmlFor="project_name">Project Name:</label>
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
                      <label htmlFor="percentage">Percentage:</label>
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
                      <label htmlFor="content">Content:</label>
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
                      Update Project
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Tab>
          <Tab key="update-content" title="Update content">
            <h1 className="p-8 text-2xl text-center">Update Card Content</h1>
            <Table
              className="text-black"
              aria-label="Example static collection table"
            >
              <TableHeader>
                <TableColumn className="text-black">ID</TableColumn>
                <TableColumn className="text-black">Title</TableColumn>
                <TableColumn className="text-black">
                  {" "}
                  Business and Client Objectives
                </TableColumn>
                <TableColumn className="text-black"> MVP and Idea</TableColumn>
                <TableColumn className="text-black">
                  {" "}
                  NA Strategy Growthhacking
                </TableColumn>
                <TableColumn className="text-black">
                  {" "}
                  Onboarding Package
                </TableColumn>
              </TableHeader>
              <TableBody>
                {projects &&
                  projects.map((project) => (
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
                          Business
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
                          MVP
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          className="hover:bg-blue-700"
                          onClick={() =>
                            setSelectedContent({
                              project: project,
                              table: "na_strategy_growthhacking",
                            })
                          }
                        >
                          NA Strategy
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
                          Onboarding
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {data.length > 0 &&
              data.map(
                (content, index) =>
                  index === currentIndex && (
                    <form key={index} onSubmit={handleSaveChanges}>
                      <div className="grid grid-cols-3 gap-4 py-8">
                        <Input
                          label="Title"
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
                          label="Descripcion"
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
                          label="Content"
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
                          label="Link"
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
                          label="Link Name"
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
                        <Input
                          label="Preview Image"
                          type="text"
                          className="text-black rounded-2xl"
                          value={content.image || ""}
                          onChange={(e) => {
                            setData(
                              data.map((item, i) => {
                                if (i === currentIndex) {
                                  item.image = e.target.value;
                                }
                                return item;
                              })
                            );
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          className="p-4 text-white bg-blue-500 rounded-2xl hover:bg-blue-700"
                          type="submit"
                        >
                          Update content
                        </button>
                        <button
                          className="p-4 text-white bg-red-500 rounded-2xl hover:bg-red-700"
                          onClick={handleDeleteClick}
                        >
                          Delete content
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
          </Tab>
        </Tabs>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </main>
  );
}
