const axios = require('axios').default;

const api_geocem = axios.create({
  baseURL: "http://200.144.244.238/api",
});

export {axios, api_geocem};
