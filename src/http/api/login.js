import axios from "../axios"

export function login(user){
   return axios.post("/user/login", user);
}

export function captcha(uuid){
   return axios.get("/captcha?uuid=" + uuid);
}