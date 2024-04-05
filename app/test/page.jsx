"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import toast, { Toaster } from "react-hot-toast";

function Page() {
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
  const [duration, setDuration] = useState(""); // Nuevo estado para la duración
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bookedHours, setBookedHours] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 para la semana actual, -1 para la semana anterior, 1 para la semana siguiente, etc.
  const [animationClass, setAnimationClass] = useState("animate-fade-down");
  const [disabledHours, setDisabledHours] = useState([]);

  const handleButtonClick = (hour) => {
    setSelectedItem(hour);
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/citas/agendadas")
      .then((response) => {
        setBookedHours(response.data);
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
      const dayIndex = selectedDate.getDay();
      const hoursForDay = bookedHours.filter((hour) => {
        const date = new Date(hour.date);
        return date.getDay() === dayIndex;
      });
      const disabledHours = hoursForDay.map((hour) => {
        return new Date(hour.date).getHours();
      });
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
    const end = start + parseInt(duration); // Calcula la hora de finalización sumando la duración a la hora de inicio
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
      const response = await axios.post(
        "http://localhost:3001/api/disponibilidad",

        { dates }
      );
      // console.log(response.data); // Descomenta esta línea si necesitas ver la respuesta para depuración
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3001/api/citas/agendadas"
      );
      setBookedHours(response.data);
      toast.success("Disponibilidad enviada correctamente.");
      setDuration("");
    } catch (error) {
      console.error("Error al actualizar bookedHours:", error);
    }
  };

  return (
    <div className="bg-white text-black grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
      <div>
        <div className="flex justify-between">
          <button
            className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-2 py-1 rounded-lg shadow-md cursor-pointer mb-2 hover:bg-gradient-to-r hover:from-fuchsia-700 hover:to-pink-700 transition-transform duration-100 ease-in-out"
            onClick={() => handleClick(-1)}
          >
            Semana anterior
          </button>
          <span className={animationClass}>
            {startOfWeek.toLocaleDateString("es-ES", options)} -{" "}
            {endOfWeek.toLocaleDateString("es-ES", options)}
          </span>
          <button
            className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-2 py-1 rounded-lg shadow-md cursor-pointer mb-2 hover:bg-gradient-to-r hover:from-fuchsia-700 hover:to-pink-700 transition-transform duration-100 ease-in-out"
            onClick={() => handleClick(1)}
          >
            Semana siguiente
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
            <div key={day} className="flex">
              <div
                className="w-28 md:w-32 cursor-pointer bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white  border border-black p-2 flex gap-2"
                onClick={() => setSelectedDay(day)}
              >
                <h2>{day}</h2>
                <div className="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                  {hoursForDay.length}
                </div>
              </div>
              <div className="flex-grow transition-transform duration-100 ease-in-out">
                <hr className="border-black" />
                {selectedDay === day &&
                  (hoursForDay.length > 0 ? (
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
                                    ? `${new Date(hour.date).toLocaleTimeString(
                                        "es-ES",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )} AM`
                                    : `${new Date(hour.date).toLocaleTimeString(
                                        "es-ES",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )} PM`}
                                </p>
                                <div className="mb-2 mt-2">
                                  <button
                                    className="px-4 py-1 hover:bg-pink-600 bg-pink-400 flex justify-start text-white rounded-xl"
                                    onClick={() => handleButtonClick(hour)}
                                  >
                                    {" "}
                                    Abrir drawer
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
                                    ? `${new Date(hour.date).toLocaleTimeString(
                                        "es-ES",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )} AM`
                                    : `${new Date(hour.date).toLocaleTimeString(
                                        "es-ES",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )} PM`}
                                </p>
                                <div className="mb-2 mt-2">
                                  <button
                                    className="px-4 py-1 hover:bg-pink-600 bg-pink-400 flex justify-start text-white rounded-xl"
                                    onClick={() => handleButtonClick(hour)}
                                  >
                                    {" "}
                                    Abrir drawer
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p>Sin citas asignadas</p>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center flex-col gap-4">
        <Calendar
          value={selectedDays}
          calendarClassName="custom-calendar"
          onChange={setSelectedDays}
          colorPrimary="#E72381"
          locale={myCustomLocale}
          shouldHighlightWeekends
        />
        {selectedDays && (
          <div className="flex justify-center items-center flex-col gap-4">
            <form
              onSubmit={handleSubmit}
              className="flex justify-center items-center flex-col gap-4"
            >
              <select
                className="w-full border border-pink-400 px-4 py-2 rounded-xl focus:outline-none"
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
                className="w-full border border-pink-400 px-4 py-2 rounded-xl focus:outline-none"
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
                className="w-full px-4 py-2 border-pink-400 border rounded-xl hover:bg-pink-400 hover:text-white"
              >
                Enviar
              </button>
            </form>
            <Toaster position="top-right" />
          </div>
        )}
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
                  ? `${new Date(selectedItem.date).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} AM`
                  : `${new Date(selectedItem.date).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} PM`}
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
            <button className="w-full bg-pink-400 hover:bg-pink-500 rounded-lg py-2 text-white">
              Eliminar Cita
            </button>
          </div>
          {isEditing ? (
            <form>
              <label>
                Nombre:
                <input
                  className="border-black border rounded-lg px-2 py-2"
                  type="text"
                  defaultValue={selectedItem.name}
                />
              </label>
              <label>
                Correo:
                <input
                  className="border-black border rounded-lg px-2 py-2"
                  type="text"
                  defaultValue={selectedItem.email}
                />
              </label>
              <label>
                Telefono:
                <input
                  className="border-black border rounded-lg px-2 py-2"
                  type="text"
                  defaultValue={selectedItem.phone}
                />
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
            className="mt-auto mb-5 w-full bg-pink-400 hover:bg-pink-600 text-white p-2 rounded"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg p-5 overflow-y-auto z-50 transform translate-x-full transition-transform duration-1000" />
      )}
    </div>
  );
}

export default Page;
