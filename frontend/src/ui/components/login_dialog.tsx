import { DialogTrigger } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../assets/dialog";
import LoginForm from "./login_form";
import { useState } from "react";
import RegisterForm from "./register_form";

export default function LoginDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {mode === "login" ? (
          <LoginForm behaviorOnSuccess={() => {}} changeMode={() => setMode("register")} />
        ) : (
          <RegisterForm behaviorOnSuccess={() => {}} changeMode={() => setMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
