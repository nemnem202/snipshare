import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Account from "./pages/account";
import Explorer from "./pages/explorer";
import NotFound from "./pages/not_found";
import Private from "./pages/private";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/explorer" replace />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/account" element={<Account />} />
        <Route path="/private/:path" element={<Private />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
