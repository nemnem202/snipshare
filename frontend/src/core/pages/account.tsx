import { useEffect, useState } from "react";
import useGetSession from "../../hooks/get_session";
import AccountTabs from "../../ui/components/account/account_tabs";
import EditableTextArea from "../../ui/components/items/editable_textarea";
import Headline from "../../ui/components/items/headline";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../ui/assets/spinner";
import FiltersProvider, { FilterContext } from "../../provider/filters_provider";
export default function Account() {
  const [loading, setLoading] = useState(true);
  const [sess, setSess] = useState<boolean>(false);
  const nav = useNavigate();
  const session = useGetSession();
  useEffect(() => {
    if (session) {
      setSess(true);
    } else {
      nav("/login?redirect=/account");
    }

    setLoading(false);
  }, [session]);
  if (!session) return;
  if (loading) {
    return (
      <div className="h-100 flex flex-col items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );
  }

  return (
    <FiltersProvider>
      <div className="main-container">
        <div className="h-[250px] pt-10 flex w-full justify-center">
          <Headline content={<EditableTextArea defaultValue={session} />} />
        </div>
        <AccountTabs />
      </div>
    </FiltersProvider>
  );
}
