import AccountTabs from "../../ui/components/account_tabs";
import EditableTextArea from "../../ui/components/editable_textarea";
import Headline from "../../ui/components/headline";
export default function Account() {
  return (
    <div className="main-container">
      <div className="h-[250px] pt-10 flex w-full justify-center">
        <Headline content={<EditableTextArea defaultValue="Utilisateur" />} />
      </div>

      <AccountTabs />
    </div>
  );
}
