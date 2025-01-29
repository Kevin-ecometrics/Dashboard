const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const cors = require("cors");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // reemplaza esto con la URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // establece esto en true si estás en https
  })
);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login",
});

// Iniciar sesion
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta SELECT:", err);
        return res.status(500).send("Error interno del servidor");
      }

      if (results.length > 0) {
        const user = results[0];

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error("Error al comparar las contraseñas:", err);
            return res.status(500).send("Error interno del servidor");
          }

          if (result) {
            // Las contraseñas coinciden
            req.session.user = user;
            console.log(req.session.user);

            // Registrar el inicio de sesión en la base de datos
            connection.query(
              "INSERT INTO login_logs (email, login_count) VALUES (?, 1) ON DUPLICATE KEY UPDATE login_count = login_count + 1, login_time = CURRENT_TIMESTAMP",
              [email],
              (err, results) => {
                if (err) {
                  console.error("Error al registrar el inicio de sesión:", err);
                  return res.status(500).send("Error interno del servidor");
                }

                res.json({
                  success: true,
                  message: "Inicio de sesión exitoso",
                });
              }
            );
          } else {
            // Las contraseñas no coinciden
            res.status(401).json({ error: "Credenciales inválidas" });
          }
        });
      } else {
        res.status(401).json({ error: "Credenciales inválidas" });
      }
    }
  );
});

// Registro
app.post("/register", (req, res) => {
  const { username, email, password, rol, additionalEmails } = req.body;

  if (!username || !email || !password || !rol) {
    return res
      .status(400)
      .json({ error: "Se requiere un correo electrónico y una contraseña." });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta SELECT:", err);
        return res.status(500).send("Error interno del servidor");
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso" });
      }

      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error("Error al hashear la contraseña:", err);
          return res.status(500).send("Error interno del servidor");
        }

        connection.query(
          "INSERT INTO users (username, email, password, rol) VALUES (?, ?, ?, ?)",
          [username, email, hashedPassword, rol],
          (err, results) => {
            if (err) {
              console.error("Error al realizar la consulta INSERT:", err);
              return res.status(500).send("Error interno del servidor");
            }

            let transporter = nodemailer.createTransport({
              host: "e-commetrics.com",
              port: 465,
              secure: true,
              auth: {
                user: "admin@e-commetrics.com",
                pass: "Wain@Cushy26",
              },
            });

            const imagePath = path.join(
              __dirname,
              "../public",
              "email_image.png"
            );

            // Configurar las opciones del correo
            let mailOptions = {
              from: "admin@e-commetrics.com",
              to: [email, ...(additionalEmails || [])].join(","), // destinatarios
              cc: "admin@e-commetrics.com", // copia
              subject: "Welcome to Ecommetrica", // Asunto
              html: `
              <p>Hello! Welcome to Ecommetrica. We are excited to work on your business and transform your vision. It will be a pleasure to collaborate with you.</p>
              <p>We are sending you your User details to access our platform. In the E-COMMETRICS DASHBOARD, log in with this email we created for you: <strong>${email}</strong> and your password: <strong>${password}</strong></p>
              <p>Once authenticated access to the <a href="https://e-commetrics.com/">E-COMMETRICS DASHBOARD</a>, you will be able to review your entire project and visualize the status of the work, as well as any upcoming tasks and/or changes that may be needed.</p>
              <p>Thank you for joining us!</p>
              <br> <!-- Salto de línea -->
              <img src="cid:unique@nodemailer.com" alt="Image" width="800" height="600">
              `,
              attachments: [
                {
                  filename: "email_image.png",
                  path: imagePath,
                  cid: "unique@nodemailer.com",
                },
              ],
            };

            // Enviar el correo
            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error("Error al enviar el correo:", err);
              } else {
                console.log("Correo enviado:", info.response);
              }
            });

            res.status(201).json({ message: "Usuario registrado con éxito" });
          }
        );
      });
    }
  );
});

// Obtener el usuario actual
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.status(401).send({ error: "No autorizado" });
  }
});

// Cerrar sesión
app.post("/logout", (req, res) => {
  if (req.session) {
    // destruye la sesión
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error interno del servidor");
      }

      // borra la cookie de sesión
      res.clearCookie("connect.sid");
      return res.send({ message: "Sesión cerrada exitosamente" });
    });
  } else {
    return res.status(400).send({ error: "No se encontró la sesión" });
  }
});

// Obtener todos los proyectos
app.get("/api/projects", (req, res) => {
  const userId = req.query.userId;

  // Primero, obtenemos el rol del usuario
  connection.query(
    "SELECT rol FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta SELECT:", err);
        return res.status(500).send("Error interno del servidor");
      }

      const userRol = results[0].rol;

      const query =
        userRol === "admin"
          ? "SELECT * FROM projects"
          : "SELECT * FROM projects WHERE id_user = ?";

      connection.query(query, [userId], (err, results) => {
        if (err) {
          console.error("Error al realizar la consulta SELECT:", err);
          return res.status(500).send("Error interno del servidor");
        }

        res.json(results);
      });
    }
  );
});

// Obtener un proyecto por su ID
app.get("/api/businessAndClientObjectives", (req, res) => {
  const { projectName } = req.query;

  const query = `
    SELECT business_and_client_objectives.*
    FROM business_and_client_objectives
    JOIN projects ON business_and_client_objectives.project_id = projects.id
    WHERE projects.project_name = ?
  `;

  connection.query(query, [projectName], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// Obtener un proyecto por su ID
app.get("/api/onboardingPackage", (req, res) => {
  const { projectName } = req.query;

  const query = `
    SELECT onboarding_package.*
    FROM onboarding_package
    JOIN projects ON onboarding_package.project_id = projects.id
    WHERE projects.project_name = ?
  `;

  connection.query(query, [projectName], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// Obtener un proyecto por su ID
app.get("/api/mvpAndIdea", (req, res) => {
  const { projectName } = req.query;

  const query = `
    SELECT mvp_and_idea.*
    FROM mvp_and_idea
    JOIN projects ON mvp_and_idea.project_id = projects.id
    WHERE projects.project_name = ?
  `;

  connection.query(query, [projectName], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// Obtener un proyecto por su ID
app.get("/api/Strategy", (req, res) => {
  const { projectName } = req.query;

  const query = `
    SELECT strategy.*
    FROM strategy
    JOIN projects ON strategy.project_id = projects.id
    WHERE projects.project_name = ?
  `;

  connection.query(query, [projectName], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// Obtener un proyecto por su ID
app.get("/api/growthHacking", (req, res) => {
  const { projectName } = req.query;

  const query = `
    SELECT growth_hacking.*
    FROM growth_hacking
    JOIN projects ON growth_hacking.project_id = projects.id
    WHERE projects.project_name = ?
  `;

  connection.query(query, [projectName], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// obtener la información de todos los usuario
app.get("/get/users", (req, res) => {
  const query = `
    SELECT *
    FROM users
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// obtener la información de todos los proyectos
app.get("/get/projects", (req, res) => {
  const query = `
    SELECT *
    FROM projects
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta SELECT:", err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// crear un nuevo proyecto
app.post("/create/projects", (req, res) => {
  const { id_user, title, percentage, content, project_name } = req.body;

  const query = `
    INSERT INTO projects (id_user, title, percentage, content, project_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [id_user, title, percentage, content, project_name],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta INSERT:", err);
        return res.status(500).send("Error interno del servidor");
      }

      res.status(201).json({ message: "Proyecto creado exitosamente" });
    }
  );
});

// crear contenido de un proyecto en especifico
app.post("/create/:table", (req, res) => {
  const table = req.params.table;
  const {
    project_id,
    content_1,
    content_2,
    content_3,
    link,
    href,
    id_user,
    image,
  } = req.body;

  const validTables = [
    "business_and_client_objectives",
    "mvp_and_idea",
    "strategy",
    "onboarding_package",
  ];
  if (!validTables.includes(table)) {
    return res.status(400).send("Tabla no válida");
  }

  const query = `
    INSERT INTO ${table} (project_id, content_1, content_2, content_3, link, href, id_user, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [project_id, content_1, content_2, content_3, link, href, id_user, image],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta INSERT:", err);
        return res.status(500).send("Error interno del servidor");
      }

      res.status(201).json({ message: "Datos insertados exitosamente" });
    }
  );
});

// Actualizar un proyecto
app.put("/projects/:id", (req, res) => {
  const id = req.params.id;
  const { title, percentage, content, project_name, id_user } = req.body;

  const query = `
    UPDATE projects
    SET title = ?, percentage = ?, content = ?, project_name = ?, id_user = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [title, percentage, content, project_name, id_user, id],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta UPDATE:", err);
        return res.status(500).send("Error interno del servidor");
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .send("No se encontró el proyecto con el id dado");
      }

      res.status(200).json({ message: "Datos actualizados exitosamente" });
    }
  );
});

// Obtenemos el contenido de un proyecto
app.get("/api/:table/:id", (req, res) => {
  const { table, id } = req.params;

  const query = `
    SELECT ${table}.*
    FROM ${table}
    JOIN projects ON ${table}.project_id = projects.id
    WHERE projects.id = ?
  `;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error(`Error al realizar la consulta SELECT en ${table}:`, err);
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// Actualizar el contenido de un proyecto
app.put("/update/:table", upload.single("imageFile"), (req, res) => {
  const table = req.params.table;
  const data = JSON.parse(req.body.data); // Datos JSON
  const file = req.file; // Archivo de imagen

  // Crear query de actualización solo para los campos proporcionados
  let query = `UPDATE ${table} SET project_id = ?, content_1 = ?, content_2 = ?, content_3 = ?, link = ?, href = ?, id_user = ?`;
  let values = [
    data.project_id,
    data.content_1,
    data.content_2,
    data.content_3,
    data.link,
    data.href,
    data.id_user,
  ];

  // Solo incluir la imagen si existe una nueva imagen en la solicitud
  if (file) {
    query += `, source = ?`; // Solo agregar el campo 'image' si se sube una nueva imagen
    values.push(file.buffer); // Guardar la imagen como buffer
  }

  // Agregar la condición para el WHERE
  query += ` WHERE id = ?`;
  values.push(data.id); // El ID del contenido a actualizar

  // Ejecutar la consulta
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error("Error al actualizar el contenido:", error);
      return res.status(500).send("Error al actualizar el contenido.");
    }
    res.send(`Contenido actualizado exitosamente en la tabla ${table}`);
  });
});

// Obtenermos la informacion en general
app.get("/get/information", (req, res) => {
  const query = `
	SELECT *
	FROM information
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(
        "Error al realizar la consulta SELECT en information:",
        err
      );
      return res.status(500).send("Error interno del servidor");
    }

    res.json(results);
  });
});

// Actualizamos la informacion en general
app.put("/updateUserInformation", (req, res) => {
  const { id, nombre, apellido, telefono, direccion, ciudad, pais, genero } =
    req.body;

  const query = `
	  UPDATE information
	  SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, ciudad = ?, pais = ?, genero = ?
	  WHERE id = ?
	`;

  connection.query(
    query,
    [nombre, apellido, telefono, direccion, ciudad, pais, genero, id],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta UPDATE:", err);
        return res.status(500).send("Error interno del servidor");
      }
      res.send("Usuario actualizado correctamente");
    }
  );
});

// Actualizamos al usuario
app.put("/updateUser", (req, res) => {
  const { id, username, email, rol } = req.body;

  const query = `
		UPDATE users
		SET username = ?, email = ?, rol = ?
		WHERE id = ?
	  `;

  connection.query(query, [username, email, rol, id], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta UPDATE:", err);
      return res.status(500).send("Error interno del servidor");
    }
    res.send("Usuario actualizado correctamente");
  });
});

// Actualizamos la contraseña
app.put("/updatePassword", (req, res) => {
  const { id, password } = req.body;

  // Hash the new password
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = `
	  UPDATE users
	  SET password = ?
	  WHERE id = ?
	`;

  connection.query(query, [hashedPassword, id], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta UPDATE:", err);
      return res.status(500).send("Error interno del servidor");
    }
    res.send("Contraseña actualizada correctamente");
  });
});

// Eliminamos el contenido de una tabla
app.delete("/delete/:table/:id", (req, res) => {
  const { table, id } = req.params;

  const query = `
	  DELETE FROM ${table}
	  WHERE id = ?
	`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error al realizar la consulta DELETE:", err);
      return res.status(500).send("Error interno del servidor");
    }
    res.send("Registro eliminado correctamente");
  });
});

// Eliminamos un proyecto
app.delete("/project/delete/:id", async (req, res) => {
  const projectId = req.params.id;

  connection.beginTransaction((error) => {
    if (error) {
      return res.status(500).send({ message: "Error starting transaction" });
    }

    connection.query(
      "DELETE FROM business_and_client_objectives WHERE project_id = ?",
      [projectId],
      (error, results) => {
        if (error) {
          return connection.rollback(() => {
            res.status(500).send({
              message: "Error deleting from business_and_client_objectives",
            });
          });
        }

        connection.query(
          "DELETE FROM mvp_and_idea WHERE project_id = ?",
          [projectId],
          (error, results) => {
            if (error) {
              return connection.rollback(() => {
                res
                  .status(500)
                  .send({ message: "Error deleting from mvp_and_idea" });
              });
            }

            connection.query(
              "DELETE FROM strategy WHERE project_id = ?",
              [projectId],
              (error, results) => {
                if (error) {
                  return connection.rollback(() => {
                    res.status(500).send({
                      message: "Error deleting from strategy",
                    });
                  });
                }

                connection.query(
                  "DELETE FROM onboarding_package WHERE project_id = ?",
                  [projectId],
                  (error, results) => {
                    if (error) {
                      return connection.rollback(() => {
                        res.status(500).send({
                          message: "Error deleting from onboarding_package",
                        });
                      });
                    }

                    connection.query(
                      "DELETE FROM projects WHERE id = ?",
                      [projectId],
                      (error, results) => {
                        if (error) {
                          return connection.rollback(() => {
                            res
                              .status(500)
                              .send({ message: "Error deleting from project" });
                          });
                        }

                        connection.commit((error) => {
                          if (error) {
                            return connection.rollback(() => {
                              res.status(500).send({
                                message: "Error committing transaction",
                              });
                            });
                          }

                          res
                            .status(200)
                            .send({ message: "Project deleted successfully" });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// creamos un nuevo contenido en una tabla
app.post("/create/content/:table", upload.single("imageFile"), (req, res) => {
  const table = req.params.table;
  const { project_id, content_1, content_2, content_3, link, href, id_user } =
    req.body;

  const source = req.file ? req.file.buffer : null;

  const validTables = [
    "business_and_client_objectives",
    "mvp_and_idea",
    "strategy",
    "onboarding_package",
    "growth_hacking",
  ];
  if (!validTables.includes(table)) {
    return res.status(400).send("Tabla no válida");
  }

  const query = `
    INSERT INTO ${table} (project_id, content_1, content_2, content_3, link, href, id_user, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [project_id, content_1, content_2, content_3, link, href, id_user, source],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta INSERT:", err);
        return res
          .status(500)
          .json({ error: `Error interno del servidor: ${err.message}` });
      }

      res.status(201).json({ message: "Datos insertados exitosamente" });
    }
  );
});

app.listen(3001, () => {
  console.log("Servidor escuchando en el puerto 3001");
});
