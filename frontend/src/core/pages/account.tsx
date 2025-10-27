import AccountTabs from "../../ui/components/account_tabs";
import Headline from "../../ui/components/headline";
export default function Account() {
  return (
    <div className="main-container">
      <div className="h-[250px] pt-10 flex w-full justify-center">
        <Headline content={<div>Utilisateur</div>} />
      </div>

      <AccountTabs />
    </div>
  );
}
