"use client";

import { storeAuthTokens } from "@/api/auth-tokens";
import { submitLogin } from "@/api/request-queries";
import { SubmitLoginCredentials } from "@/types/api";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState<SubmitLoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmitLogin(event: FormEvent) {
    event.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      setIsLoading(true);

      const responseData = await submitLogin(payload);

      const { refresh, access } = responseData;

      storeAuthTokens(refresh, access);

      router.push("/");
      return;
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLoginFormChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <form
      onSubmit={handleSubmitLogin}
      className="flex flex-col border-2 rounded-2xl p-5 w-72 max-sm:w-[80%]"
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
      <Button type="submit" color="primary" isLoading={isLoading}>
        Entrar
      </Button>
    </form>
  );
}
