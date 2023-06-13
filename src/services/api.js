const axios = require('axios').default;

// const protocol = (process.env.NODE_ENV == 'development') ? 'http' : 'https'

const api_geocem = axios.create({
  baseURL: 'https://geocem.centrodametropole.fflch.usp.br/api',
});

export {axios, api_geocem};
