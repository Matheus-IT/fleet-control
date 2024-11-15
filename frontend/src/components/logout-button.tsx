import { setAuthCredentials } from "@/api/auth-tokens";
import { redirectToLogin } from "@/api/axios-instance";
import { Button } from "@nextui-org/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  function handleLogout() {
    setAuthCredentials(null, null);
    redirectToLogin();
  }

  return (
    <Button onClick={handleLogout} isIconOnly color="primary" title="Sair">
      <LogOut size={16} />
    </Button>
  );
}
