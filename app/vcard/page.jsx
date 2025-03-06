"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { FaDownload, FaTrash } from "react-icons/fa6"; // Importación de iconos

import {
  FaCheck,
  FaXmark,
  FaPowerOff,
  FaHouse,
  FaPlus,
  FaUsers,
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
import api_URL from "../utils/api";

function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleButtonClick = (index) => {
    setCurrentIndex(index * 3);
  };

  const [user, setUser] = useState(null);
  const router = useRouter();
  const qrRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const numberOfButtons = Math.ceil(projects.length / 3);

  let avatarURl;

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const res = await axios.get(`${api_URL}/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
          const resProjects = await axios.get(
            `${api_URL}/api/projects?userId=${res.data.user.id}`,
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
      await axios.post(`${api_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Estados del formulario QR/VCF
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    org: "",
    address: "",
    note: "",
  });
  const [showQR, setShowQR] = useState(false);
  const [showButton, setShowButton] = useState(true);

  // Validar formulario
  const validateForm = () => {
    const { name, lastname, email, phone, org, address, note } = formData;
    if (!name || !lastname || !email || !phone || !org || !address || !note) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    if (phone.length !== 10) {
      alert("El número de teléfono debe tener exactamente 10 caracteres.");
      return false;
    }
    return true;
  };

  // Generar vCard
  const generateVCard = () => {
    if (!validateForm()) return;

    const vCardContent = `BEGIN:VCARD\nVERSION:3.0\nN:${formData.lastname}\nFN:${formData.name}\nEMAIL;INTERNET;WORK:${formData.email}\nORG:${formData.org}\nTEL;TYPE=WORK,VOICE:${formData.phone}\nADR:${formData.address}\nNOTE:${formData.note}\nEND:VCARD`;

    const blob = new Blob([vCardContent], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contacto.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Mostrar QR
  const handleShowQR = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${api_URL}/vcard`, formData);
      setShowQR(true);
      setShowButton(false);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar los datos.");
    }
  };

  // Reiniciar formulario
  const handleReset = () => {
    setFormData({
      name: "",
      lastname: "",
      email: "",
      phone: "",
      org: "",
      address: "",
      note: "",
    });
    setShowQR(false);
    setShowButton(true);
  };

  // Descargar QR
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "QR_Code.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  if (
    user.email === "juanmanuel@e-commetrics.com" ||
    user.email === "kevin@e-commetrics.com"
  ) {
    avatarURl = "/logo_nav.jpg";
  } else if (user.email === "mydentist@reformadental.com") {
    avatarURl = "/reforma logo.png";
  } else if (user.email === "dsolis@syltalento.com") {
    avatarURl = "/SYL logo.jpeg";
  } else if (user.email === "draanyimanchola@bitescreadoresdesonrisas.com") {
    avatarURl = "/bites logo.png";
  } else {
    avatarURl = "/logo_nav.jpg";
  }

  return (
    <section className="h-screen w-screen text-white bg-[#21233A] overflow-x-hidden">
      <div className="flex">
        {/* Menú lateral */}
        <aside className="hidden h-screen px-8 py-12 w-36 sm:block md:w-1/5 bg-[#191c33]">
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
                <AccordionItem
                  key="6"
                  aria-label="Information"
                  indicator={({ isOpen }) =>
                    isOpen ? <FaXmark /> : <FaCheck />
                  }
                  title={<span style={{ color: "white" }}>VCard</span>}
                >
                  <Link
                    href="/vcard"
                    className="text-white hover:text-gray-300"
                  >
                    <ul>
                      <li>
                        <div className="flex items-center gap-x-2">
                          <FaUsers />
                          <span className="text-white uppercase hover:underline">
                            Generar VCard
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

        <div className="flex-1 bg-gradient-to-r from-indigo-900 via-indigo-400 to-indigo-900 p-8">
          <motion.div
            className="container mx-auto bg-white rounded-lg shadow-lg p-8 max-w-md text-black space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center">
              <Image
                src={avatarURl}
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold mb-6 text-center">VCF y QR</h1>

            {/* Mostrar el QR arriba del formulario */}
            {showQR && (
              <motion.div
                ref={qrRef}
                className="flex flex-col  items-center space-y-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <QRCodeCanvas
                  id="qrCode"
                  value={`BEGIN:VCARD\nVERSION:3.0\nFN:${formData.name}\nN:${formData.lastname}\nORG:${formData.org}\nTEL;TYPE=WORK,VOICE:${formData.phone}\nEMAIL;INTERNET;WORK:${formData.email}\nADR;TYPE=WORK:;;${formData.address}\nNOTE:${formData.note}\nEND:VCARD`}
                  size={256}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo.png", // Ruta del logo
                    height: 50,
                    width: 50,
                    excavate: true,
                  }}
                />
                <button
                  onClick={downloadQRCode}
                  className="bg-white border border-[#a32054] text-black px-6 py-3 rounded-lg hover:bg-[#f5e1e8] transition-all w-full flex items-center justify-center gap-2"
                >
                  <FaDownload /> {/* Icono de descarga */}
                  Descargar QR
                </button>
                <button
                  onClick={generateVCard}
                  className="bg-white border border-[#a32054] text-black px-6 py-3 rounded-lg hover:bg-[#f5e1e8] transition-all w-full flex items-center justify-center gap-2"
                >
                  <FaDownload /> {/* Icono de descarga */}
                  Descargar VCF
                </button>
                <button
                  onClick={handleReset}
                  className="bg-white border border-[#a32054] text-black px-6 py-3 rounded-lg hover:bg-[#f5e1e8] transition-all w-full flex items-center justify-center gap-2"
                >
                  <FaTrash /> {/* Icono de bote de basura */}
                  Limpiar Formulario
                </button>
              </motion.div>
            )}

            {/* Formulario */}
            <motion.div
              className="space-y-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Apellido"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                maxLength="10"
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              <input
                type="text"
                name="org"
                placeholder="Empresa"
                value={formData.org}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              <input
                type="text"
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
              <input
                type="text"
                name="note"
                placeholder="Nota"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </motion.div>

            {showButton && (
              <motion.button
                onClick={handleShowQR}
                className="bg-white border border-[#a32054] text-black px-6 py-3 rounded-lg hover:bg-[#f5e1e8] transition-all w-full"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Mostrar Datos
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Page;
