import { useNavigate } from "react-router-dom";
import Headline from "../../ui/components/headline";
import LoginForm from "../../ui/components/login_form";

export default function LoginPage() {
  const nav = useNavigate();
  return (
    <div className="main-container">
      <Headline content="Se connecter" />
      <LoginForm behaviorOnSuccess={() => {}} changeMode={() => nav("/register")} />
    </div>
  );
}
