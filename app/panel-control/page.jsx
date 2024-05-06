"use client";
import Container from "../components/container";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { jsPDF } from "jspdf";
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

export default function Page() {
  const [selected, setSelected] = useState(1);

  // Función para manejar el cambio de opción
  const handleOptionChange = (option) => {
    setSelected(option);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const nombre = document.getElementById("nombre").value;
    doc.text(
      "Ecommetrica guarda la siguiente informacion en sus bases de datos",
      10,
      10
    );
    doc.text(
      "respaldando todo y teniendo la seguidad de todo los datos que se guarde.",
      10,
      20
    );
    doc.text("Nombre: " + document.getElementById("nombre").value, 10, 30);
    doc.text("Apellido: " + document.getElementById("apellido").value, 10, 40);
    doc.text("Teléfono: " + document.getElementById("direccion").value, 10, 50);
    doc.text("Dirección: " + document.getElementById("telefono").value, 10, 60);
    doc.text("Ciudad: " + document.getElementById("ciudad").value, 10, 70);
    doc.text("País: " + document.getElementById("pais").value, 10, 80);
    doc.text(
      "Fecha de Nacimiento: " +
      document.getElementById("fechaNacimiento").value,
      10,
      90
    );
    doc.text("Género: " + document.getElementById("genero").value, 10, 100);
    doc.text("Rol: " + document.getElementById("rol").value, 10, 110);
    doc.text("Correo: " + document.getElementById("email").value, 10, 120);
    doc.text(
      "Contraseña: " + document.getElementById("password").value,
      10,
      130
    );

    doc.save(`Ecommetrica_Cliente_${nombre}.pdf`);
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
        `https://e-commetrics.com/updateUserInformation`,
        formValues
      );
      console.log(res.data);
      toast.success("Usuario actualizado exitosamente", { duration: 3000 });
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
      const res = await axios.put(
        `https://e-commetrics.com/updateUser`,
        formValues
      );
      console.log(res.data);
      toast.success("Usuario actualizado exitosamente", { duration: 3000 });
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
        const res = await axios.get(`https://e-commetrics.com/api/user`, {
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
        const res = await axios.get(`https://e-commetrics.com/get/information`);
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
        const res = await axios.get(`https://e-commetrics.com/get/users`);
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
      const res = await axios.put(
        `https://e-commetrics.com/updatePassword`,
        formValues
      );
      console.log(res.data);
      toast.success("Contraseña actualizada exitosamente", { duration: 3000 });
      toggleDrawer();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar contraseña", { duration: 3000 });
    }
  };

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

  if (user.rol !== "admin") {
    router.push("/not-found");
    return null;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formFields = [
      "nombre",
      "apellido",
      "telefono",
      "direccion",
      "ciudad",
      "pais",
      "fechaNacimiento",
      "genero",
      "rol",
      "email",
      "password",
    ];
    const isFormValid = formFields.every(
      (field) => event.target[field].value.trim() !== ""
    );

    if (!isFormValid) {
      toast.error("Por favor, complete todos los campos", { duration: 3000 });
      return;
    }

    const telefonoValue = event.target.telefono.value.trim();
    if (!/^\d{10}$/.test(telefonoValue)) {
      toast.error(
        "El campo de teléfono debe contener solo números y tener entre 1 y 10 dígitos",
        {
          duration: 3000,
        }
      );
      return;
    }
    const nombre = event.target.nombre.value;
    const fechaNacimiento = event.target.fechaNacimiento.value;
    const year = fechaNacimiento.split("-")[0];
    const lastTwoDigitsOfYear = year.slice(-2);

    const username = `${nombre}${lastTwoDigitsOfYear}`;

    const registerData = {
      username,
      email: event.target.email.value,
      password: event.target.password.value,
      rol: event.target.rol.value,
    };
    const informationData = {
      nombre,
      apellido: event.target.apellido.value,
      telefono: event.target.telefono.value,
      direccion: event.target.direccion.value,
      ciudad: event.target.ciudad.value,
      pais: event.target.pais.value,
      fechaNacimiento,
      genero: event.target.genero.value,
    };
    try {
      const registerRes = await axios.post(
        `https://e-commetrics.com/register`,
        registerData,
        {
          withCredentials: true,
        }
      );
      toast.success("usuario creado exitosamente", { duration: 3000 }); // Mostrar notificación de éxito
      console.log(registerRes.data);
      event.target.reset();
      const informationRes = await axios.post(
        `https://e-commetrics.com/information`,
        informationData,
        {
          withCredentials: true,
        }
      );
      console.log(informationRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar usuario", { duration: 3000 }); // Mostrar notificación de error
    }
  };
  return (
    <div className="flex ">
      <aside className="hidden sm:block w-72 bg-[#21233A] overflow-auto py-4">
        <Avatar src="/logo_nav.jpg" className="h-24 w-24 mx-auto mb-4" />
        <hr className="mb-4" />
        <ul className="flex justify-center items-center flex-col">
          <li className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl" onClick={() => handleOptionChange(1)}>Add Client</li>
          <li className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl" onClick={() => handleOptionChange(2)}>Update Client</li>
          <li className="mb-2 cursor-pointer text-white hover:bg-gray-100 hover:text-black px-4 py-2 rounded-xl" onClick={() => handleOptionChange(3)}>Update User</li>
          <Link href="/dashboard">
            <li className="cursor-pointer text-sm hover:bg-gray-100 text-white hover:text-black px-4 py-2 rounded-xl">
              Return to Dashboard
            </li>
          </Link>
        </ul>
      </aside>
      <div className="flex flex-col px-12 h-[900px] bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900 text-white flex-grow">
        <Container title="Panel Administrativo" />
        {selected === 1 && <div>
          <h1 className="text-start font-bold text-2xl mb-8">Add client</h1>
          <div className="p-8 text-black bg-white rounded-xl ">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-4 gap-4 mt-4"
            >
              <div className="mb-4">
                <label htmlFor="nombre" className="block">
                  Nombre:
                </label>
                <Input
                  placeholder="Nombre"
                  type="text"
                  id="nombre"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apellido" className="block">
                  Apellido:
                </label>
                <Input
                  placeholder="Apellido"
                  type="text"
                  id="apellido"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="telefono" className="block">
                  Teléfono:
                </label>
                <Input
                  placeholder="Teléfono"
                  type="text"
                  id="telefono"
                  maxLength={10}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="direccion" className="block">
                  Dirección:
                </label>
                <Input
                  placeholder="Dirección"
                  type="text"
                  id="direccion"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="ciudad" className="block">
                  Ciudad:
                </label>
                <Input
                  placeholder="Ciudad"
                  type="text"
                  id="ciudad"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pais" className="block">
                  País:
                </label>
                <Input
                  placeholder="País"
                  type="text"
                  id="pais"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fechaNacimiento" className="block ">
                  Fecha de Nacimiento:
                </label>
                <Input
                  placeholder="Fecha de Nacimiento"
                  type="date"
                  id="fechaNacimiento"
                  className="px-4 py-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block">
                  Correo electrónico:
                </label>
                <Input
                  placeholder="Correo electrónico"
                  type="email"
                  id="email"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block">
                  Password:
                </label>
                <Input
                  placeholder="Password"
                  type="password"
                  id="password"
                  className="px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="genero" className="block">
                  Género:
                </label>
                <select
                  id="genero"
                  className="px-4 py-2 border border-gray-300 rounded-md text-black"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="rol" className="block">
                  Rol:
                </label>
                <select
                  id="rol"
                  defaultValue="usuario"
                  className="px-4 py-2 border border-gray-300 rounded-md text-black"
                >
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuario</option>
                </select>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={generatePDF}
                  className="w-48 h-12 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                >
                  Generar PDF
                </button>
                <button
                  type="submit"
                  className="w-48 h-12 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                >
                  Registrar usuario
                </button>
              </div>{" "}
            </form>
          </div>
          <Toaster position="bottom-right" reverseOrder={false} />
        </div>}
        {selected === 2 && <div>
          <h1 className="text-start font-bold text-2xl px-8">Update Client</h1>

          <div className="p-8 text-black">
            <Table isCompact aria-label="Example static collection table">
              <TableHeader>
                <TableColumn># ID</TableColumn>
                <TableColumn>First Name</TableColumn>
                <TableColumn>Last Name</TableColumn>
                <TableColumn>Gender</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {client?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.nombre}</TableCell>
                    <TableCell>{client.apellido}</TableCell>
                    <TableCell>{client.genero}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        key={1}
                        onClick={() => handleEditClick(client)}
                      >
                        Edit Client
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              monitor 1msmo
            </Table>
          </div>
          <div>
            {selectedUser && (
              <form
                onSubmit={handleSubmitClient}
                className="grid grid-cols-4 gap-4 px-8 mt-4 text-black"
              >
                <div hidden>
                  <label htmlFor="id" className="block">
                    ID:
                  </label>
                  <Input
                    placeholder="ID"
                    type="text"
                    id="id"
                    value={selectedUser.id}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-white">
                    Nombre:
                  </label>
                  <Input
                    placeholder="Nombre"
                    type="text"
                    id="nombre"
                    value={selectedUser.nombre}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        nombre: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="apellido" className="block text-white">
                    Apellido:
                  </label>
                  <Input
                    placeholder="Apellido"
                    type="text"
                    id="apellido"
                    value={selectedUser.apellido}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        apellido: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="telefono" className="block text-white">
                    Teléfono:
                  </label>
                  <Input
                    placeholder="Teléfono"
                    type="text"
                    id="telefono"
                    maxLength={10}
                    value={selectedUser.telefono}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        telefono: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="direccion" className="block text-white">
                    Dirección:
                  </label>
                  <Input
                    placeholder="Dirección"
                    type="text"
                    id="direccion"
                    value={selectedUser.direccion}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        direccion: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="ciudad" className="block text-white">
                    Ciudad:
                  </label>
                  <Input
                    placeholder="Ciudad"
                    type="text"
                    id="ciudad"
                    value={selectedUser.ciudad}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        ciudad: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="pais" className="block text-white">
                    País:
                  </label>
                  <Input
                    placeholder="País"
                    type="text"
                    id="pais"
                    value={selectedUser.pais}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        pais: e.target.value,
                      })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="genero" className="block text-white">
                    Género:
                  </label>
                  <select
                    id="genero"
                    className="w-full px-4 py-4 border border-gray-300 rounded-md "
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div className="gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full h-12 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                  >
                    Update Client
                  </button>
                </div>
              </form>
            )}
          </div>
          <Toaster position="bottom-right" reverseOrder={false} />
        </div>}
        {selected === 3 && <div>
          <h1 className="text-start font-bold text-2xl mb-6">Update User</h1>

          <div className="p-8 text-black bg-white rounded-xl">
            <Table isCompact aria-label="Example static collection table">
              <TableHeader>
                <TableColumn># ID</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Rol</TableColumn>
                <TableColumn>UserName</TableColumn>
                <TableColumn>Edit User</TableColumn>
                <TableColumn>Update Password</TableColumn>
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
                        Update Password
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
                    ID:
                  </label>
                  <Input
                    placeholder="ID"
                    type="text"
                    id="id"
                    value={selectedUserClient.id}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-white">
                    Email:
                  </label>
                  <Input
                    placeholder="Email"
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
                    Rol:
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
                    <option value="admin">Administrador</option>
                    <option value="usuario">Usuario</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-white">
                    UserName:
                  </label>
                  <Input
                    placeholder="UserName"
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
                    Update User
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
                      ID:
                      <input
                        type="text"
                        name="id"
                        value={selectedUsername ? selectedUsername.id : ""}
                        readOnly
                        className="border border-gray-300 rounded-md px-2 py-1 w-full mt-2 focus:outline-none"
                      />
                    </label>
                    <label>
                      Username:
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
                      New Password:
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
                      Update Password
                    </button>
                  </form>
                  <hr className="border border-gray-400 mb-4 mt-2" />
                  <button
                    className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Drawer>
            </>
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </div>}
      </div>
    </div>
  );
}
