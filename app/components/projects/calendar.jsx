"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button, Link, Avatar, Divider } from "@nextui-org/react";
import { FaPowerOff, FaBars, FaWhatsapp, FaCalendar } from "react-icons/fa6";
import { Pompiere, Poppins, Montserrat } from "next/font/google";
import Image from "next/image";

const pompiere = Pompiere({
  display: "swap",
  weight: "400",
});

const poppins = Poppins({
  display: "swap",
  weight: "700",
});

const montserrat = Montserrat({
  display: "swap",
  weight: "800",
});
function Page({ projects }) {
  let avatarURl;
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };
    fetchUser();
  }, [router]);

  const validation = projects.map((project) => {
    return project.title;
  });

  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const myCustomLocale = {
    // months list by order
    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],

    // week days by order
    weekDays: [
      {
        name: "Domingo", // used for accessibility
        short: "D", // displayed at the top of days' rows
        isWeekend: true, // is it a formal weekend or not?
      },
      {
        name: "Lunes",
        short: "L",
      },
      {
        name: "Martes",
        short: "M",
      },
      {
        name: "Miércoles",
        short: "M",
      },
      {
        name: "Jueves",
        short: "J",
      },
      {
        name: "Viernes",
        short: "V",
      },
      {
        name: "Sábado",
        short: "S",
        isWeekend: false,
      },
    ],

    // just play around with this number between 0 and 6
    weekStartingIndex: 0,

    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject) {
      return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date) {
      return new Date(date.year, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date) {
      return new Date(date.year, date.month, 0).getDate();
    },

    // return a transformed digit to your locale
    transformDigit(digit) {
      return digit;
    },

    // texts in the date picker
    nextMonth: "Next Month",
    previousMonth: "Previous Month",
    openMonthSelector: "Open Month Selector",
    openYearSelector: "Open Year Selector",
    closeMonthSelector: "Close Month Selector",
    closeYearSelector: "Close Year Selector",
    defaultPlaceholder: "Select...",

    // for input range value
    from: "from",
    to: "to",

    // used for input value when multi dates are selected
    digitSeparator: ",",

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: false,
  };

  const options = { year: "numeric", month: "long", day: "numeric" };
  const [selectedDays, setSelectedDays] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookedHours, setBookedHours] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [animationClass, setAnimationClass] = useState("animate-fade-down");
  const [disabledHours, setDisabledHours] = useState([]);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const handleButtonClick = (hour) => {
    setSelectedItem(hour);
    setName(hour.name);
    setEmail(hour.email);
    setPhone(hour.phone);
    const dateTime = new Date(hour.date);
    const time =
      dateTime.getHours().toString().padStart(2, "0") +
      ":" +
      dateTime.getMinutes().toString().padStart(2, "0");
    const adjustedDate = new Date(
      dateTime.getTime() - dateTime.getTimezoneOffset() * 60000
    );
    setDate(adjustedDate.toISOString().split("T")[0]);
    setTime(time);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    axios
      .get(`https://bitescreadoresdesonrisas.com/api/citas/agendadas`)
      .then((response) => {
        setBookedHours(response.data);
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (bookedHours && selectedDays) {
      const selectedDate = new Date(
        selectedDays.year,
        selectedDays.month - 1,
        selectedDays.day
      );

      const disabledHours = bookedHours
        .filter((hour) => {
          const date = new Date(hour.date);
          return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
          );
        })
        .map((hour) => new Date(hour.date).getHours());

      setDisabledHours(disabledHours);
    }
  }, [selectedDays, bookedHours]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleClick = (direction) => {
    setCurrentWeek(currentWeek + direction);
    setAnimationClass("");
    setTimeout(() => setAnimationClass("animate-fade-down"), 0);
  };

  const now = new Date();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 1 + currentWeek * 7
  );
  const endOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 6 + currentWeek * 7
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = parseInt(startTime);
    const end = start + parseInt(duration);
    const dates = [];

    if (selectedDays) {
      for (let i = start; i < end; i++) {
        const date = new Date(
          selectedDays.year,
          selectedDays.month - 1,
          selectedDays.day,
          i
        );
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
          date.getHours()
        ).padStart(2, "0")}:00:00`;
        dates.push(formattedDate);
      }
    }

    if (!startTime || !duration) {
      toast.error("Por favor, selecciona una hora y su duracion.");
      return;
    }

    try {
      await axios.post(
        "https://bitescreadoresdesonrisas.com/api/disponibilidad",

        { dates }
      );
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      return;
    }

    try {
      const response = await axios.get(
        "https://bitescreadoresdesonrisas.com/api/citas/agendadas"
      );
      setBookedHours(response.data);
      toast.success("Disponibilidad enviada correctamente.");
      setDuration("");
    } catch (error) {
      console.error("Error al actualizar bookedHours:", error);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "¿Estás seguro de que quieres eliminar esta cita?"
    );
    if (!confirmation) {
      return;
    }
    try {
      await axios.delete(
        `https://bitescreadoresdesonrisas.com/api/citas/delete/${selectedItem.id}`
      );
      setBookedHours(bookedHours.filter((hour) => hour.id !== selectedItem.id));
      toast.success("Cita eliminada correctamente.");
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error al eliminar la cita:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const dateTime = `${date}T${time}`;

    {
      try {
        await axios.put(
          `https://bitescreadoresdesonrisas.com/api/citas/update/${selectedItem.id}`,
          {
            name,
            email,
            phone,
            date: dateTime,
          }
        );
        toast.success("Cita actualizada correctamente.");
        setIsDrawerOpen(false);
        setIsEditing(false);
      } catch (error) {
        console.error("Error al actualizar la cita:", error);
        toast.error("Error al actualizar la cita.");
      }
    }

    try {
      const response = await axios.get(
        "https://bitescreadoresdesonrisas.com/api/citas/agendadas"
      );
      setBookedHours(response.data);
      setDuration("");
    } catch (error) {
      console.error("Error al actualizar bookedHours:", error);
    }
  };

  if (user.email === "juanmanuel@e-commetrics.com") {
    avatarURl = "/logo_nav.jpg"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "mydentist@reformadental.com") {
    avatarURl = "/reforma logo.png"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "dsolis@syltalento.com") {
    avatarURl = "/SYL logo.jpeg"; // Reemplaza esto con la ruta a la imagen del usuario
  } else if (user.email === "draanyimanchola@bitescreadoresdesonrisas.com") {
    avatarURl = "/bites logo.png"; // Reemplaza esto con la ruta a la imagen del usuario
  } else {
    avatarURl = "/logo_nav.jpg"; // Reemplaza esto con la ruta a la imagen del usuario por defecto
  }

  return (
    <div className="bg-white flex">
      <aside className="hidden bg-[#2F1945] h-screen  px-8 py-12 sm:block md:w-1/5">
        <div className="flex flex-col items-center gap-4">
          <Avatar src={avatarURl} className="h-24 w-24" />
          <h1
            className={`flex items-center justify-start text-2xl animate-jump-in ${montserrat.className}`}
          >
            {user.rol === "usuario" ? titleProject : "Admin"}
          </h1>
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
          <Button className="text-white bg-blue-500 text-center hover:bg-blue-700 uppercase">
            LOG OUT
          </Button>
        </div>
        <div
          className={`bottom-10 absolute flex-col flex text-center text-[14px] ${montserrat.className}`}
        >
          <span> ©2023 Bites Creadores de sonrisas.</span>
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
          <h1 className="text-white text-3xl">Calendar</h1>
          <Image src="/logo_calendar.webp" alt="Logo" width={200} height={50} />
        </section>
        <h1
          className={`mt-32 mb-8 px-16 text-[#3B238C] font-bold text-[31px] ${poppins.className}`}
        >
          Panel de Control
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 px-16 gap-32">
          <div>
            <h1
              className={`text-[40px] text-[#504774] mb-4 ${pompiere.className}`}
            >
              Agenda de citas:
            </h1>
            <div className="flex gap-8 bg-[#FFE3F1] rounded-tr-2xl rounded-tl-2xl border-4 border-[#E0E2E5]">
              <button
                className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-2 rounded-tl-2xl shadow-md cursor-pointer hover:bg-gradient-to-r hover:from-fuchsia-700 hover:to-pink-700 transition-transform duration-100 ease-in-out"
                onClick={() => handleClick(-1)}
              >
                <Image width={20} height={20} src="/arrow_left.svg" alt="" />
              </button>
              <span
                className={`${animationClass}  text-[#E72381]  flex items-center font-bold`}
              >
                {startOfWeek.toLocaleDateString("es-ES", options)} -{" "}
                {endOfWeek.toLocaleDateString("es-ES", options)}
              </span>
              <button
                className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-2 py-1 rounded-tr-2xl shadow-md cursor-pointer hover:bg-gradient-to-r hover:from-fuchsia-700 hover:to-pink-700 transition-transform duration-100 ease-in-out"
                onClick={() => handleClick(1)}
              >
                <Image width={20} height={20} src="/arrow_right.svg" alt="" />
              </button>
            </div>
            {daysOfWeek.map((day, index) => {
              const hoursForDay = bookedHours.filter((hour) => {
                const date = new Date(hour.date);
                return (
                  date.getDay() === index + 1 &&
                  date >= startOfWeek &&
                  date <= endOfWeek
                );
              });

              return (
                <div key={day} className="flex border-4 border-[#E0E2E5]">
                  <div
                    className={`w-28 md:w-40 flex gap-2 items-center ${
                      index % 2 === 0
                        ? "bg-[#FE81BD] text-white"
                        : "bg-[#F3F3F3] text-[#E72381]"
                    } bg-cover border border-white font-bold`}
                  >
                    {" "}
                    <div className="bg-[#6BBAE9] px-4 text-white text-sm flex items-center justify-center p-4">
                      {hoursForDay.length}
                    </div>
                    <div className="w-28">{day}</div>{" "}
                  </div>
                  <div
                    className={`relative p-4 ${
                      index % 2 === 0 ? "bg-white" : "bg-[#FFE3F1]"
                    } w-full`}
                  >
                    {" "}
                    <Image
                      width={40}
                      height={40}
                      src={
                        selectedDay === day
                          ? "/arrow_up.svg"
                          : "/arrow_down.svg"
                      }
                      alt="arrow_down"
                      onClick={() => {
                        if (selectedDay === day) {
                          setSelectedDay(null);
                        } else {
                          setSelectedDay(day);
                        }
                      }}
                      className="mx-auto cursor-pointer"
                    />
                    {selectedDay === day && (
                      <div className="absolute left-2 z-10 mt-2 overflow-x-hidden rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-80">
                        {hoursForDay.length > 0 ? (
                          hoursForDay
                            .sort(
                              (a, b) =>
                                new Date(a.date).getHours() -
                                new Date(b.date).getHours()
                            )
                            .map((hour) => (
                              <div
                                className="flex flex-col gap-2 md:w-[300px]  mx-auto justify-center bg-neutral-50 rounded-lg shadow p-2 mb-4"
                                key={hour.id}
                              >
                                <div className="flex flex-col">
                                  {hour.name === "" &&
                                  hour.email === "" &&
                                  hour.phone === "" ? (
                                    <div>
                                      <p>
                                        Hora bloqueada:{" "}
                                        {new Date(hour.date).toLocaleDateString(
                                          "es-ES",
                                          {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          }
                                        )}{" "}
                                        a las{" "}
                                        {new Date(hour.date).getHours() <= 11
                                          ? `${new Date(
                                              hour.date
                                            ).toLocaleTimeString("es-ES", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })} AM`
                                          : `${new Date(
                                              hour.date
                                            ).toLocaleTimeString("es-ES", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })} PM`}
                                      </p>
                                      <div className="mb-2 mt-2">
                                        <button
                                          className="px-4 py-1 hover:bg-pink-600 bg-pink-400 flex justify-start text-white rounded-xl"
                                          onClick={() =>
                                            handleButtonClick(hour)
                                          }
                                        >
                                          {" "}
                                          Actualizar cita
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="font-bold text-neutral-700 italic">
                                        Nombre: {hour.name}
                                      </span>
                                      <p>Correo: {hour.email}</p>
                                      <p>Telefono:{hour.phone}</p>
                                      <p>
                                        Cita asignada:{" "}
                                        {new Date(hour.date).toLocaleDateString(
                                          "es-ES",
                                          {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          }
                                        )}{" "}
                                        a las{" "}
                                        {new Date(hour.date).getHours() <= 11
                                          ? `${new Date(
                                              hour.date
                                            ).toLocaleTimeString("es-ES", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })} AM`
                                          : `${new Date(
                                              hour.date
                                            ).toLocaleTimeString("es-ES", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })} PM`}
                                      </p>
                                      <div className="mb-2 mt-2">
                                        <button
                                          className="px-4 py-1 hover:bg-pink-600 bg-pink-400 flex justify-start text-white rounded-xl"
                                          onClick={() =>
                                            handleButtonClick(hour)
                                          }
                                        >
                                          {" "}
                                          Actualizar cita
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                        ) : (
                          <p>Sin citas asignadas</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-start items-center flex-col gap-4">
            <h1
              className={`text-[40px] text-[#504774] mb-4 ${pompiere.className}`}
            >
              Panel de bloqueo:
            </h1>
            <div className="border-5 border-[#E0E2E5] rounded-2xl py-4">
              <Calendar
                value={selectedDays}
                calendarClassName="responsive-calendar"
                onChange={setSelectedDays}
                colorPrimary="#E72381"
                locale={myCustomLocale}
                shouldHighlightWeekends
              />
              {selectedDays && (
                <div className="flex justify-center items-center flex-col gap-4">
                  <form
                    onSubmit={handleSubmit}
                    className="flex justify-center items-center flex-col  gap-4"
                  >
                    <select
                      className="w-full  bg-[#FFA5D0] focus:bg-white focus:text-black text-white px-4 py-2 rounded-xl focus:outline-none font-bold"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      <option value="">
                        {[...Array(9).keys()].every((i) =>
                          disabledHours.includes(i + 9)
                        )
                          ? "No hay horarios disponibles"
                          : "Selecciona una hora de inicio"}
                      </option>
                      {[...Array(9).keys()].map(
                        (_, i) =>
                          !disabledHours.includes(i + 9) && (
                            <option key={i} value={i + 9}>
                              {i + 9}:00
                            </option>
                          )
                      )}
                    </select>
                    <select
                      className="w-full bg-[#FFA5D0] focus:bg-white focus:text-black font-bold text-white px-4 py-2 rounded-xl focus:outline-none"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="">Selecciona la duración</option>
                      {[...Array(10).keys()] // Genera un array de 10 elementos (desde 0 hasta 9)
                        .filter((i) => {
                          const endHour = i + 1 + parseInt(startTime);
                          const range = Array.from(
                            { length: i + 1 },
                            (_, k) => k + parseInt(startTime)
                          );
                          return (
                            endHour <= 18 &&
                            (parseInt(startTime) !== 17 || i === 0) &&
                            !range.some((hour) => disabledHours.includes(hour))
                          ); // Verifica si cada hora dentro del rango de duración está deshabilitada
                        })
                        .map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} hora(s)
                          </option>
                        ))}
                    </select>

                    <button
                      type="submit"
                      className="w-full font-bold px-4 py-2 bg-[#FFA5D0] text-white border rounded-xl hover:bg-pink-400 hover:text-white"
                    >
                      Enviar
                    </button>
                  </form>
                  <Toaster position="top-right" />
                </div>
              )}
            </div>
          </div>

          {isDrawerOpen ? (
            <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg p-5 overflow-y-auto z-50 transform translate-x-0 transition-transform flex flex-col">
              {selectedItem && (
                <>
                  <h1 className="uppercase">Gestion de citas</h1>
                  <hr className="border-black mb-2" />
                  {selectedItem.name ? (
                    <p>Nombre: {selectedItem.name}</p>
                  ) : (
                    <p>Hora bloqueada</p>
                  )}
                  {selectedItem.email && <p>Correo: {selectedItem.email}</p>}
                  {selectedItem.phone && <p>Telefono: {selectedItem.phone}</p>}
                  <p>
                    Fecha:{" "}
                    {new Date(selectedItem.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    a las{" "}
                    {new Date(selectedItem.date).getHours() <= 11
                      ? `${new Date(selectedItem.date).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )} AM`
                      : `${new Date(selectedItem.date).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )} PM`}
                  </p>
                </>
              )}
              <div className="flex justify-between gap-2 mt-2 mb-4">
                {selectedItem.name &&
                  selectedItem.email &&
                  selectedItem.phone &&
                  selectedItem.date && (
                    <button
                      className="w-full bg-pink-400 hover:bg-pink-500 rounded-lg py-2 text-white"
                      onClick={() => setIsEditing(true)}
                    >
                      Editar Cita
                    </button>
                  )}
                <button
                  onClick={handleDelete}
                  className="w-full bg-pink-400 hover:bg-pink-500 rounded-lg py-2 text-white"
                >
                  Eliminar Cita
                </button>
              </div>
              {isEditing ? (
                <form onSubmit={handleUpdate}>
                  <label>
                    Nombre:
                    <input
                      className="border-black border rounded-lg px-2 py-2"
                      type="text"
                      defaultValue={selectedItem.name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label>
                    Correo:
                    <input
                      className="border-black border rounded-lg px-2 py-2"
                      type="text"
                      defaultValue={selectedItem.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label>
                    Telefono:
                    <input
                      className="border-black border rounded-lg px-2 py-2"
                      type="text"
                      defaultValue={selectedItem.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                  <label>
                    Fecha:
                    <input
                      className="border-black border rounded-lg px-4 w-full py-2"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        if (selectedDate.getDay() === 6) {
                          // 0 es domingo
                          alert(
                            "Los domingos no están disponibles. Por favor, selecciona otro día."
                          );
                          return;
                        }
                        setDate(e.target.value);
                      }}
                      required
                    />
                  </label>
                  <label>
                    Hora:
                    <select
                      className="border-black border rounded-lg px-2 py-2 w-full"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    >
                      <option value="">Selecciona una hora</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </label>
                  <div className="flex justify-between mt-2">
                    <button
                      className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg py-2 px-2"
                      type="submit"
                    >
                      Guardar cambios
                    </button>
                    <button
                      className="bg-pink-400 hover:bg-pink-500 text-white rounded-lg py-2 px-2"
                      type="button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : null}

              <button
                onClick={handleDrawerClose}
                className="mt-2 mb-5 w-full bg-pink-400 hover:bg-pink-600 text-white p-2 rounded"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg p-5 overflow-y-auto z-50 transform translate-x-full transition-transform duration-1000" />
          )}
          <Toaster position="top-right" />
        </div>
      </div>
    </div>
  );
}

export default Page;
