import { useNavigate, useSearchParams } from "react-router-dom";
import Headline from "../../ui/components/headline";
import RegisterForm from "../../ui/components/register_form";

export default function RegisterPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  return (
    <div className="main-container">
      <Headline content="Créer un compte" />
      <RegisterForm
        behaviorOnSuccess={redirect ? () => nav(redirect) : () => nav("/explorer")}
        changeMode={() => nav(redirect ? `/login?redirect=${redirect}` : "/login")}
      />
    </div>
  );
}
