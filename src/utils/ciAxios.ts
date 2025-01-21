import axios from "axios";

const ciAxios = axios;
ciAxios.defaults.timeout = import.meta.env.VITE_AXIOS_TIMEOUT;

export { ciAxios };
