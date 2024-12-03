"use client";

import {
  Avatar,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Logo from "./logo";
import LogoutButton from "./logout-button";
import { useUserInfoStore } from "@/stores/user-info";
import { useGetProfileInfo } from "@/hooks/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DRIVER_PROFILE } from "@/api/user";

export default function MyNavbar() {
  const { data, error } = useGetProfileInfo();
  const { setUserInfo, userInfo } = useUserInfoStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setUserInfo(data);
    }
  }, [data, setUserInfo]);

  return (
    <>
      <Navbar isBordered>
        <span
          className="inline-flex items-center w-fit hover:cursor-pointer"
          onClick={() => router.replace("/")}
        >
          <Logo />
          <span className="font-bold ml-2">DPL Construções</span>
        </span>

        <NavbarContent justify="start" className="grow justify-between ml-32">
          <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Início
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" aria-current="page">
              Equipes
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" aria-current="page">
              Configurações
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

          <LogoutButton />
        </NavbarContent>
      </Navbar>

      {error && <h1>Ocorreu um erro: {error.message}</h1>}
    </>
  );
}
