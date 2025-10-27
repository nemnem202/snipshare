import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Account from "./pages/account";
import Explorer from "./pages/explorer";
import NotFound from "./pages/not_found";
import Private from "./pages/private";
import Header from "../ui/components/header";
import LoginPage from "./pages/login_page";
import RegisterPage from "./pages/register_page";
import SingleSnippetPage from "./pages/single_snippet_page";

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/explorer" replace />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/account" element={<Account />} />
        <Route path="/private/:path" element={<Private />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unrepertoried/:id" element={<SingleSnippetPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
