/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Button, Link, Avatar, Divider } from "@nextui-org/react";
import { FaBars } from "react-icons/fa6";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  display: "swap",
  weight: "800",
  subsets: ["latin"],
});
function comment({ user }) {
  let avatarURl;

  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [blogNames, setBlogNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCommentText, setSelectedCommentText] = useState("");
  const [selectedBlogName, setSelectedBlogName] = useState("");

  useEffect(() => {
    const fetchBlogNames = async () => {
      try {
        const res = await axios.get("https://mongeortopedia.com/api/blogNames");
        setBlogNames(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get("https://mongeortopedia.com/api/comments");
        setComments(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogNames();
    fetchComments();
  }, []);

  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = comments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getBlogName = (id) => {
    const blog = blogNames.find((blog) => blog.id === id);
    return blog ? blog.name : id;
  };

  const handleApproveClick = (comment) => {
    setSelectedComment(comment);
    setModalAction("approve");
    setShowModal(true);
  };

  const handleRejectClick = (comment) => {
    setSelectedComment(comment);
    setModalAction("reject");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      const newStatus = modalAction === "approve" ? "aceptado" : "rechazado";
      await axios.put(
        `https://mongeortopedia.com/api/comments/${selectedComment.id}`,
        {
          estatus: newStatus,
        }
      );
      setShowModal(false);
      // Actualizar el estado de los comentarios después de la solicitud PUT
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === selectedComment.id
            ? { ...comment, estatus: newStatus }
            : comment
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const year = new Date().getFullYear();

  if (user.email === "juanmanuel@e-commetrics.com") {
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

  const handleCommentClick = (commentText, blogId) => {
    setSelectedCommentText(commentText);
    setSelectedBlogName(getBlogName(blogId));
    setShowCommentModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="bg-white flex">
      <aside className="hidden bg-[#2F1945] h-screen  px-8 py-12 sm:block md:w-1/5">
        <div className="flex flex-col items-center gap-4">
          <Avatar src={avatarURl} className="h-24 w-24" />
          <h1
            className={`flex items-center justify-start text-2xl animate-jump-in ${montserrat.className}`}
          ></h1>
        </div>
        <Divider className="my-4 bg-white" />
        <div className="relative py-8">
          <ul>
            <li className="flex flex-col gap-y-4 cursor-pointer">
              <span
                className="flex items-center cursor-pointer gap-4"
                onClick={() => window.history.back()}
              >
                <FaBars className="inline-block mr-2" />
                ALL CONTENT
              </span>
            </li>
          </ul>
        </div>
        <div className="flex justify-center gap-4 flex-col lg:flex-row">
          <Link href="/dashboard">
            <Button className="text-white bg-blue-500 text-center hover:bg-blue-700 uppercase">
              Dashboard
            </Button>
          </Link>
        </div>
        <div
          className={`bottom-10 absolute flex-col flex text-center text-[14px] ${montserrat.className}`}
        >
          <span> &copy; {year} Ecommetrica.</span>
          <span>Todos los derechos reservados.</span>
        </div>
      </aside>
      <div className="bg-white text-black">
        <section
          className="fixed top-0 w-screen md:w-4/5 h-24 flex justify-between items-center px-16 z-50"
          style={{
            background:
              "linear-gradient(0deg, #3A228B 0%, #847EFC 50%, #4C39A7 88%, #3A228B 100%)",
          }}
        >
          <h1 className="text-white text-3xl">BlogsApp</h1>
          <Image src="/logo_calendar.webp" alt="Logo" width={200} height={50} />
        </section>
        <div className="py-32">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Correo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Comentario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estatus
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha de Creación
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((comment) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {comment.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.correo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        handleCommentClick(comment.comentario, comment.blog_id)
                      }
                    >
                      {comment.comentario.length > 20
                        ? `${comment.comentario.substring(0, 20)}...`
                        : comment.comentario}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.estatus}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(comment.fecha_creacion).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="space-x-2 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comment.estatus === "aceptado" ? (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleRejectClick(comment)}
                      >
                        Rechazar
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleApproveClick(comment)}
                      >
                        Aprobar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 justify-start items-center px-4">
            {Array.from(
              { length: Math.ceil(comments.length / itemsPerPage) },
              (_, index) => (
                <button
                  className={`px-4 py-2 rounded-md space-x-4 ${
                    currentPage === index + 1 ? "bg-blue-700" : "bg-blue-400"
                  } text-white`}
                  key={index}
                  onClick={() => paginate(index + 1)}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div className="bg-white p-6 rounded-md">
                <h2 className="text-lg font-bold mb-4">
                  Confirmar{" "}
                  {modalAction === "approve" ? "Aprobación" : "Rechazo"}
                </h2>
                <p>
                  ¿Estás seguro de que deseas{" "}
                  {modalAction === "approve" ? "aprobar" : "rechazar"} este
                  comentario?
                </p>
                <div className="mt-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
                    onClick={handleConfirmAction}
                  >
                    Confirmar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          {showCommentModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div className="bg-white p-6 rounded-md">
                <h2 className="text-lg font-bold mb-4">Comentario Completo</h2>
                <p>{selectedCommentText}</p>
                <p className="mt-4">
                  <strong>Blog:</strong> {selectedBlogName}
                </p>
                <div className="mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setShowCommentModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default comment;
