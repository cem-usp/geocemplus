const axios = require('axios').default;

const protocol = (process.env.NODE_ENV == 'development') ? 'http' : 'https'

const api_geocem = axios.create({
  baseURL: protocol+"://200.144.244.238/api",
});
console.log(process.env.NODE_ENV)
console.log(protocol)
export {axios, api_geocem};
