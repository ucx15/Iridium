// File: Frontend/src/config.ts

// To use it, create a .env file in the root of your project with the following content:
// VITE_BACKEND_URI = <backend url>


const environment = import.meta.env;

const BACKEND_URI = environment.VITE_BACKEND_URI || "http://localhost:5000/api";
console.log("Environment variables:", environment.VITE_BACKEND_URI);

export default BACKEND_URI;
