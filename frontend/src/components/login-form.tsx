"use client";

import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  async function handleSubmitLogin(event: FormEvent) {
    event.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        // mode: "no-cors",
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      console.log("response", res.status, responseData);
    } catch (error) {
      console.log("error", error);
    }
  }

  function handleLoginFormChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <form
      onSubmit={handleSubmitLogin}
      className="flex flex-col border-2 rounded-2xl p-5 max-sm:w-[90%]"
    >
      <h1 className="text-3xl text-center mb-3">Login</h1>
      <Input
        type="email"
        name="email"
        label="Digite seu email..."
        className="mb-3"
        value={formData.email}
        onChange={handleLoginFormChange}
        isRequired
      />
      <Input
        type="password"
        name="password"
        label="Digite sua senha..."
        className="mb-4"
        value={formData.password}
        onChange={handleLoginFormChange}
        isRequired
      />
      <Button type="submit" color="primary">
        Entrar
      </Button>
    </form>
  );
}
