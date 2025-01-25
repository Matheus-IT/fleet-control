"use client";

import { storeAuthTokens } from "@/api/auth-tokens";
import { submitLogin } from "@/api/request-queries";
import { SubmitLoginCredentialsSchema } from "@/api/zod-schemas";
import { SubmitLoginCredentials } from "@/types/api";
import { Button, Form, Input } from "@heroui/react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState<SubmitLoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmitLogin(event: FormEvent) {
    event.preventDefault();

    const result = SubmitLoginCredentialsSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error?.formErrors.fieldErrors);
      return;
    }

    try {
      setIsLoading(true);

      const responseData = await submitLogin(result.data);

      const { refresh, access } = responseData;

      storeAuthTokens(refresh, access);

      router.push("/");
      return;
    } catch (error) {
      console.log("error", error);
      if (error instanceof AxiosError) {
        setErrors(error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleLoginFormChange(event: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <Form
      onSubmit={handleSubmitLogin}
      className="flex flex-col border-2 rounded-2xl p-5 w-72 max-sm:w-[80%]"
    >
      <h1 className="text-3xl text-center mb-3">Login</h1>
      <Input
        name="email"
        label="Digite seu email..."
        className="mb-3"
        value={formData.email}
        onChange={handleLoginFormChange}
        isRequired
        errorMessage={errors.email}
        isInvalid={!!errors.email}
      />
      <Input
        type="password"
        name="password"
        label="Digite sua senha..."
        className="mb-4"
        value={formData.password}
        onChange={handleLoginFormChange}
        isRequired
        errorMessage={errors.password}
        isInvalid={!!errors.password}
      />

      <p className="text-sm text-center text-red-500 mb-3">{errors.detail}</p>

      <Button
        className="w-full"
        type="submit"
        color="primary"
        isLoading={isLoading}
      >
        Entrar
      </Button>
    </Form>
  );
}
