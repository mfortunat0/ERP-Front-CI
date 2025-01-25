import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ciAxios } from "@/utils/ciAxios";
import style from "./index.module.css";
import logoUrl from "@/assets/logo.png";
import { formatDate } from "@/utils/formatDate";
import { toastError, toastPromise } from "@/utils/toast";

interface User {
  USUARIO: string;
  CODVEN: number;
  CODFIR: number;
}

export function Login() {
  const [inputUser, setInputUser] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storageUser = localStorage.getItem("user");
    if (storageUser) {
      if (window.innerWidth >= 1024) {
        const [, extractedDate] = storageUser.split("-");
        const date = formatDate(new Date());
        if (extractedDate === date) {
          navigate("/home");
        }
      } else {
        navigate("/home");
      }
    }
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!inputUser || !inputPassword) {
      toastError({ message: "Campos não foram preenchidos corretamente" });
    } else {
      const { data } = await toastPromise({
        asyncFunction: ciAxios.post<User[]>(
          `${import.meta.env.VITE_SERVER_NODE_URL}/usuario/login`,
          {
            user: inputUser,
            password: inputPassword,
          }
        ),
        pendingMessage: "Validando usuario",
        onError: "Usuario ou senha invalidos",
        onSucess: "Bem vindo 👋",
      });

      if (data.length === 1) {
        const user = data[0];
        const date = formatDate(new Date());
        localStorage.setItem("user", `${user.USUARIO}-${date}`);
        localStorage.setItem("codfir", data[0].CODFIR.toString());
        navigate("/home");
      } else {
        setInputPassword("");
        toastError({ message: "Usuario ou senha invalidos" });
      }
    }
  };

  const onInputUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputUser(event.target.value.toUpperCase());
  };

  const onInputPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value.toUpperCase());
  };

  return (
    <section className={style.loginContainer}>
      <form onSubmit={onSubmit}>
        <img loading="lazy" src={logoUrl} alt="" />
        <input
          type="text"
          value={inputUser}
          placeholder="Nome..."
          onChange={onInputUserChange}
        />
        <input
          type="password"
          value={inputPassword}
          placeholder="Senha..."
          onChange={onInputPasswordChange}
        />
        <button>Entrar</button>
      </form>
    </section>
  );
}
