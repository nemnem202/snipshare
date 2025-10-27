import AccountTabs from "../../ui/components/account_tabs";
import Headline from "../../ui/components/headline";
export default function Account() {
  return (
    <div className="main-container">
      <Headline content={<div>Utilisateur</div>} />
      <AccountTabs />
    </div>
  );
}
