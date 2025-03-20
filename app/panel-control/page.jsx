"use client";
import Container from "../components/container";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@nextui-org/react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import api_URL from "../utils/api";
import useTranslation from "../components/translation";

export default function Page() {
  const [selected, setSelected] = useState(1);

  // Función para manejar el cambio de opción
  const handleOptionChange = (option) => {
    setSelected(option);
  };
  const [additionalEmails, setAdditionalEmails] = useState("");
  const [locale, setLocale] = useState("en"); // idioma por defecto
  const translations = useTranslation(locale);
  const handleChangeLanguage = (lang) => {
    setLocale(lang);
  };

  const [user, setUser] = useState(null);
  const [clientUser, setClientUser] = useState(null);
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserClient, setSelectedUserClient] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSubmitClient = async (event) => {
    event.preventDefault();
    const formFields = [
      "id",
      "nombre",
      "apellido",
      "telefono",
      "direccion",
      "ciudad",
      "pais",
      "genero",
    ];

    const formValues = {};
    formFields.forEach((field) => {
      formValues[field] = document.getElementById(field).value;
    });

    console.log(formValues); // Verifica los datos enviados en la solicitud
    try {
      const res = await axios.put(
        `${api_URL}/updateUserInformation`,
        formValues
      );
      console.log(res.data);
      toast.success("Actualización de usuario exitosa", {
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar usuario", { duration: 3000 });
    }
  };

  const HandleSubmitUserClient = async (event) => {
    event.preventDefault();
    const formFields = ["id", "email", "rol", "username"];
    const formValues = {};
    formFields.forEach((field) => {
      formValues[field] = document.getElementById(field).value;
    });

    console.log(formValues); // Verifica los datos enviados en la solicitud
    try {
      const res = await axios.put(`${api_URL}/updateUser`, formValues);
      console.log(res.data);
      toast.success("Actualización de usuario exitosa", {
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar usuario", { duration: 3000 });
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleEditClickUser = (clientUser) => {
    setSelectedUserClient(clientUser);
  };

  const handleEditClickUserPassword = (clientUser) => {
    setSelectedUsername(clientUser);
    toggleDrawer();
  };

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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${api_URL}/get/information`);
        setClient(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${api_URL}/get/users`);
        setClientUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const formFields = ["id", "username", "password"];
    const formValues = {};
    formFields.forEach((field) => {
      formValues[field] = document.querySelector(`[name=${field}]`).value;
    });
    console.log(formValues);
    try {
      const res = await axios.put(`${api_URL}/updatePassword`, formValues);
      console.log(res.data);
      toast.success("Contraseña actualizada exitosamente", {
        duration: 3000,
      });
      toggleDrawer();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar la contraseña", {
        duration: 3000,
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${api_URL}/logout`, {}, { withCredentials: true });
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
          <div className="mt-4 text-2xl text-white">
            {translations.panel_loading}
          </div>
        </div>
      </div>
    );
  }

  if (user.rol !== "admin") {
    router.push("/not-found");
    return null;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formFields = ["nombre", "rol", "email", "password"];
    const isFormValid = formFields.every(
      (field) => event.target[field].value.trim() !== ""
    );

    if (!isFormValid) {
      toast.error("Por favor, complete todos los campos", {
        duration: 3000,
      });
      return;
    }

    const nombre = event.target.nombre.value;

    const username = `${nombre}`;

    const registerData = {
      username,
      email: event.target.email.value,
      password: event.target.password.value,
      rol: event.target.rol.value,
      additionalEmails: additionalEmails
        ? additionalEmails.split(",").map((email) => email.trim())
        : [],
    };

    try {
      const registerRes = await axios.post(
        `${api_URL}/register`,
        registerData,
        {
          withCredentials: true,
        }
      );
      toast.success("Usuario creado exitosamente", {
        duration: 3000,
      }); // Mostrar notificación de éxito
      console.log(registerRes.data);
      event.target.reset();
      setAdditionalEmails(""); // Limpiar el campo de correos adicionales
    } catch (err) {
      console.error(err);
      toast.error("Error al crear usuario", {
        duration: 3000,
      }); // Mostrar notificación de error
    }
  };
  return (
    <div className="flex ">
      <aside className="hidden sm:block w-72 bg-[#21233A] overflow-auto py-4">
        <Avatar src="/logo_nav.jpg" className="h-24 w-24 mx-auto mb-4" />
        <hr className="mb-4" />
        <ul className="flex justify-center items-center flex-col">
          <li
            className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl"
            onClick={() => handleOptionChange(1)}
          >
            {translations.panel_addClient}
          </li>
          <li
            className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl"
            onClick={() => handleOptionChange(2)}
          >
            {translations.panel_updateUser}
          </li>
          <Link href="/dashboard">
            <li className="cursor-pointer text-sm hover:bg-gray-100 text-white hover:text-black px-4 py-2 rounded-xl">
              {translations.panel_returnToDashboard}
            </li>
          </Link>
        </ul>
        {/*
  <div className="flex justify-center space-x-4">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={() => handleChangeLanguage("en")}
    >
      English
    </button>
    <button
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      onClick={() => handleChangeLanguage("es")}
    >
      Español
    </button>
  </div>
*/}
      </aside>
      <div className="flex flex-col px-12 h-[900px] bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900 text-white flex-grow">
        <Container title="Panel Administrativo" />
        {selected === 1 && (
          <div>
            <h1 className="text-start font-bold text-2xl mb-8">
              {translations.panel_addClient}
            </h1>
            <div className="p-8 text-black bg-white rounded-xl ">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-4 gap-4 mt-4"
              >
                <div className="mb-4">
                  <label htmlFor="nombre" className="block">
                    {translations.panel_userName}:
                  </label>
                  <Input
                    placeholder={translations.panel_userName}
                    type="text"
                    id="nombre"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block">
                    {translations.panel_email}:
                  </label>
                  <Input
                    placeholder={translations.panel_email}
                    type="email"
                    id="email"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block">
                    {translations.panel_password}:
                  </label>
                  <Input
                    placeholder={translations.panel_password}
                    type="password"
                    id="password"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="rol" className="block">
                    {translations.panel_additionalEmails}
                  </label>
                  <Input
                    label={translations.panel_additionalEmails}
                    value={additionalEmails}
                    onChange={(e) => setAdditionalEmails(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="rol" className="block">
                    {translations.panel_role}:
                  </label>
                  <select
                    id="rol"
                    defaultValue="usuario"
                    className="px-4 py-4 border border-gray-300 rounded-md text-black"
                  >
                    <option value="admin">{translations.panel_admin}</option>
                    <option value="usuario">{translations.panel_user}</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="w-48 h-12 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                  >
                    {translations.panel_registerUser}
                  </button>
                </div>{" "}
              </form>
            </div>
            <Toaster position="bottom-right" reverseOrder={false} />
          </div>
        )}

        {selected === 2 && (
          <div>
            <h1 className="text-start font-bold text-2xl mb-6">
              {translations.panel_updateUserButton}
            </h1>

            <div className="p-8 text-black bg-white rounded-xl">
              <Table isCompact aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn># {translations.panel_id}</TableColumn>
                  <TableColumn>{translations.panel_email}</TableColumn>
                  <TableColumn>{translations.panel_role}</TableColumn>
                  <TableColumn>{translations.panel_user}</TableColumn>
                  <TableColumn>{translations.panel_editUser}</TableColumn>
                  <TableColumn>{translations.panel_updatePassword}</TableColumn>
                </TableHeader>
                <TableBody>
                  {clientUser?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.rol}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          color="primary"
                          key={1}
                          onClick={() => handleEditClickUser(user)}
                        >
                          Edit User
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="danger"
                          onClick={() => handleEditClickUserPassword(user)}
                          key={2}
                        >
                          {translations.panel_updatePassword}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              {selectedUserClient && (
                <form
                  onSubmit={HandleSubmitUserClient}
                  className="grid grid-cols-4 gap-4 px-8 mt-4 text-black"
                >
                  <div hidden>
                    <label htmlFor="id" className="block text-white">
                      {translations.panel_id}:
                    </label>
                    <Input
                      placeholder={translations.panel_id}
                      type="text"
                      id="id"
                      value={selectedUserClient.id}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nombre" className="block text-white">
                      {translations.panel_email}:
                    </label>
                    <Input
                      placeholder={translations.panel_email}
                      type="text"
                      id="email"
                      value={selectedUserClient.email}
                      onChange={(e) =>
                        setSelectedUserClient({
                          ...selectedUserClient,
                          email: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="rol" className="block text-white">
                      {translations.panel_role}:
                    </label>
                    <select
                      id="rol"
                      value={selectedUserClient.rol}
                      onChange={(e) =>
                        setSelectedUserClient({
                          ...selectedUserClient,
                          rol: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md text-black"
                    >
                      <option value="admin">{translations.panel_admin}</option>
                      <option value="usuario">{translations.panel_user}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="username" className="block text-white">
                      {translations.panel_user}:
                    </label>
                    <Input
                      placeholder={translations.panel_user}
                      type="text"
                      id="username"
                      value={selectedUserClient.username}
                      onChange={(e) =>
                        setSelectedUserClient({
                          ...selectedUserClient,
                          username: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="gap-4 mt-6 ">
                    <button
                      type="submit"
                      className="w-full h-12 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                    >
                      {translations.panel_updateUserButton}
                    </button>
                  </div>
                </form>
              )}
              <>
                <Drawer
                  open={isOpen}
                  onClose={toggleDrawer}
                  direction="right"
                  duration={300}
                >
                  <div className="p-4">
                    <form
                      className="text-black mt-4"
                      onSubmit={handlePasswordChange}
                    >
                      <label>
                        {translations.panel_id}:
                        <input
                          type="text"
                          name="id"
                          value={selectedUsername ? selectedUsername.id : ""}
                          readOnly
                          className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2 focus:outline-none"
                        />
                      </label>
                      <label>
                        {translations.panel_username}:
                        <input
                          type="text"
                          name="username"
                          value={
                            selectedUsername ? selectedUsername.username : ""
                          }
                          readOnly
                          className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2 focus:outline-none"
                        />
                      </label>
                      <label className="block mt-2">
                        {translations.panel_newPassword}:
                        <input
                          type="password"
                          name="password"
                          required
                          className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2 focus:outline-none"
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 w-full rounded-md"
                      >
                        {translations.panel_updatePassword}
                      </button>
                    </form>
                    <hr className="border border-gray-400 mb-4 mt-2" />
                    <button
                      className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {translations.panel_close}
                    </button>
                  </div>
                </Drawer>
              </>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        )}
      </div>
    </div>
  );
}
