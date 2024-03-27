const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");
const cors = require("cors");
const saltRounds = 10;
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // reemplaza esto con la URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

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
            res.json({ success: true, message: "Inicio de sesión exitoso" });
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

app.post("/register", (req, res) => {
  const { username, email, password, rol } = req.body;

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
              from: "admin@e-commetrics.com", // remitente
              to: email, // destinatario
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

app.post("/information", (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    direccion,
    ciudad,
    pais,
    fechaNacimiento,
    genero,
  } = req.body;

  if (
    !nombre ||
    !apellido ||
    !telefono ||
    !direccion ||
    !ciudad ||
    !pais ||
    !fechaNacimiento ||
    !genero
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  connection.query(
    "INSERT INTO information (nombre, apellido, telefono, direccion, ciudad, pais, fechaNacimiento, genero) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nombre,
      apellido,
      telefono,
      direccion,
      ciudad,
      pais,
      fechaNacimiento,
      genero,
    ],
    (err, results) => {
      if (err) {
        console.error("Error al realizar la consulta INSERT:", err);
        return res.status(500).send("Error interno del servidor");
      }

      res.status(201).json({ message: "Información guardada con éxito" });
    }
  );
});

app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.status(401).send({ error: "No autorizado" });
  }
});

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

app.get("/api/naStrategyGrowthhacking", (req, res) => {
  const { projectName } = req.query;

  const query = `
    SELECT na_strategy_growthhacking.*
    FROM na_strategy_growthhacking
    JOIN projects ON na_strategy_growthhacking.project_id = projects.id
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
    "na_strategy_growthhacking",
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

app.put("/projects/:id", (req, res) => {
  const id = req.params.id;
  const { title, percentage, content, project_name } = req.body;

  const query = `
    UPDATE projects
    SET title = ?, percentage = ?, content = ?, project_name = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [title, percentage, content, project_name, id],
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

app.put("/update/:table", (req, res) => {
  const table = req.params.table;
  const data = req.body;
  const query = `UPDATE ${table} SET project_id = ?, content_1 = ?, content_2 = ?, content_3 = ?, link = ?, href = ?, id_user = ?, image = ? WHERE id = ?`;
  const values = [
    data.project_id,
    data.content_1,
    data.content_2,
    data.content_3,
    data.link,
    data.href,
    data.id_user,
    data.image,
    data.id,
  ];

  connection.query(query, values, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.send(`Datos actualizados en la tabla ${table}`);
  });
});

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

app.listen(3001, () => {
  console.log("Servidor escuchando en el puerto 3001");
});
