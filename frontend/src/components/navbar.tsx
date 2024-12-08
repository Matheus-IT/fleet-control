"use client";

import {
  Avatar,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Logo from "./logo";
import { setAuthCredentials } from "@/api/auth-tokens";
import { redirectToLogin } from "@/api/axios-instance";

import { useUserInfoStore } from "@/stores/user-info";
import { useGetProfileInfo } from "@/hooks/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DRIVER_PROFILE } from "@/api/user";

export default function MyNavbar() {
  const { data, error } = useGetProfileInfo();
  const { setUserInfo, userInfo } = useUserInfoStore((state) => state);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setUserInfo(data);
    }
  }, [data, setUserInfo]);

  function handleLogout() {
    setAuthCredentials(null, null);
    redirectToLogin();
  }

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
        <span
          className="inline-flex items-center w-fit hover:cursor-pointer"
          onClick={() => router.replace("/")}
        >
          <Logo />
          <span className="font-bold ml-2">DPL Construções</span>
        </span>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />

        <NavbarMenu>
          <NavbarMenuItem>
            <Link color="primary" className="w-full" href="#" size="lg">
              Veículos
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="primary" className="w-full" href="#" size="lg">
              Configurações
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              onClick={handleLogout}
              color="primary"
              className="w-full"
              href="#"
              size="lg"
            >
              Sair
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>

        <NavbarContent
          justify="start"
          className="grow justify-between ml-32 hidden sm:flex"
        >
          <NavbarItem isActive>
            <Link href="#" className="hover:cursor-pointer" aria-current="page">
              Veículos
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" className="hover:cursor-pointer" aria-current="page">
              Configurações
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              onClick={handleLogout}
              className="hover:cursor-pointer"
              aria-current="page"
            >
              Sair
            </Link>
          </NavbarItem>

          <div className="flex gap-2 items-center ml-auto">
            {data && <span>{data.nameOfUser}</span>}
            <Avatar
              isBordered
              className="transition-transform"
              size="sm"
              src={
                userInfo?.userProfiles.includes(DRIVER_PROFILE)
                  ? "/images/driver.png"
                  : "/images/supervisor.png"
              }
            />
          </div>
        </NavbarContent>
      </Navbar>

      {error && <h1>Ocorreu um erro: {error.message}</h1>}
    </>
  );
}
