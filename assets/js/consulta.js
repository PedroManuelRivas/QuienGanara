const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const getData = async () => {
  let { data } = await axios.get("https://randomuser.me/api");
  return {
    id: uuidv4().slice(30),
    nombre: `${data.results[0].name.title} ${data.results[0].name.first} ${data.results[0].name.last}`,
    correo: data.results[0].email,
    pais: data.results[0].location.country,
    foto: data.results[0].picture.medium,
  };
};

module.exports = getData;
