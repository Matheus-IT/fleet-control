import {
  Avatar,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Logo from "./logo";

export default function MyNavbar() {
  return (
    <Navbar isBordered>
      <span className="inline-flex items-center w-fit">
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

        <Avatar
          isBordered
          className="transition-transform ml-auto"
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
        />
      </NavbarContent>
    </Navbar>
  );
}
