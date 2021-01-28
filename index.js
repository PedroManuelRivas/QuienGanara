const http = require("http");
const fs = require("fs");
const getData = require("./assets/js/consulta.js");
const enviar = require("./assets/js/mailer");
const axios = require("axios");
const url = require("url");

http
  .createServer(async (req, res) => {
    const { usuarios } = JSON.parse(
      fs.readFileSync("./assets/json/usuarios.json", "utf8")
    );
    const premio = JSON.parse(
      fs.readFileSync("./assets/json/premio.json", "utf8")
    );

    // REQUERIMIENTO 1
    if (req.url == "/") {
      res.setHeader("Content-type", "text/html");
      const data = fs.readFileSync("index.html", "utf8");
      res.end(data);
    }
    // REQUERIMIENTO 2
    else if (req.url == "/usuario" && req.method == "POST") {
      const usuario = await getData();
      usuarios.push(usuario);
      fs.writeFileSync(
        "./assets/json/usuarios.json",
        JSON.stringify({ usuarios })
      );
      res.end(JSON.stringify({ usuario }));
    } // REQUERIMIENTO 3
    else if (req.url == "/usuarios" && req.method == "GET") {
      res.end(JSON.stringify({ usuarios }));
    } // REQUERIMIENTO 4
    else if (req.url == "/premio" && req.method == "GET") {
      res.end(JSON.stringify(premio));
    }
    //REQUERIMIENTO 5
    else if (req.url == "/premio" && req.method == "PUT") {
      let body;
      req.on("data", (payload) => {
        body = JSON.parse(payload);
        console.log(body);
      });
      req.on("end", () => {
        fs.writeFileSync("./assets/json/premio.json", JSON.stringify(body));
        res.end();
      });
    }
    // REQUERIMIENTO 6
    else if (req.url == "/ganador" && req.method == "GET") {
      const posicionGanador = Math.floor(Math.random() * usuarios.length) + 0;
      const arregloCorreos = usuarios.map((e) => (e = e.correo));
      arregloCorreos.push("pedromanuelrivas@gmail.com");
      const { nombre, foto } = usuarios[posicionGanador];
      res.end(JSON.stringify({ nombre, foto }));
      const template = `Anuncio: El ganador de ¿Quién Ganará? fué: <h2>${nombre}</h2>. Gracias a todos por participar`;
      await enviar(
        arregloCorreos,
        "Ganador de Sorteo ¿Quién Ganará?",
        template
      );
      res.end();
    }
    // REQUERIMIENTO 6
    else if (req.url.match(/^\/[a-zA-Z0-9]+$/)) {
      const id = req.url.replace("/", "").toLowerCase();
      const usuario = usuarios.find((u) => u.id == id);
      res.end(usuario ? JSON.stringify({ usuario }) : "Usuario no Existe");
    } else {
      res.end("Ruta no encontrada");
    }
  })
  .listen(3000);
