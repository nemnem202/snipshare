import { useNavigate, useSearchParams } from "react-router-dom";
import Headline from "../../ui/components/items/headline";
import LoginForm from "../../ui/components/auth/login_form";

export default function LoginPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div className="main-container">
      <Headline content="Se connecter" />
      <LoginForm
        behaviorOnSuccess={redirect ? () => nav(redirect) : () => nav("/explorer")}
        changeMode={() => nav(redirect ? `/register?redirect=${redirect}` : "/register")}
      />
    </div>
  );
}
