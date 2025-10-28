import { useNavigate } from "react-router-dom";
import Headline from "../../ui/components/headline";
import RegisterForm from "../../ui/components/register_form";

export default function RegisterPage() {
  const nav = useNavigate();
  return (
    <div className="main-container">
      <Headline content="Créer un compte" />
      <RegisterForm behaviorOnSuccess={() => {}} changeMode={() => nav("/login")} />
    </div>
  );
}
