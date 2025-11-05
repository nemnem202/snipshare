import { useEffect, useState } from "react";
import useGetSession from "../../hooks/get_session";
import AccountTabs from "../../ui/components/account_tabs";
import EditableTextArea from "../../ui/components/editable_textarea";
import Headline from "../../ui/components/headline";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../ui/assets/spinner";
export default function Account() {
  const [loading, setLoading] = useState(true);
  const [sess, setSess] = useState<boolean>(false);
  const nav = useNavigate();
  const session = useGetSession();
  useEffect(() => {
    if (session === undefined) return; // toujours en chargement

    if (session) {
      setSess(true);
    } else {
      nav("/login?redirect=/account");
    }

    setLoading(false);
  }, [session]);

  if (loading) {
    return (
      <div className="h-100 flex flex-col items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="h-[250px] pt-10 flex w-full justify-center">
        <Headline content={<EditableTextArea defaultValue="Utilisateur" />} />
      </div>
      <AccountTabs />
    </div>
  );
}
