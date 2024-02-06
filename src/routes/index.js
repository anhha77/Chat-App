import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import AccountPage from "../pages/AccountPage";
import UserProfilePage from "../pages/UserProfilePage";
import BlankLayout from "../layouts/BlankLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import AuthRequire from "./AuthRequire";
import useAuth from "../hooks/useAuth";
import ModalUpdateComment from "../components/ModalUpdateComment";
import ModalUpdatePost from "../components/ModalUpdatePost";

function Router() {
  const location = useLocation();
  let background = location.state && location.state.background;
  const { user } = useAuth();

  return (
    <>
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            <AuthRequire>
              <MainLayout />
            </AuthRequire>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="user/:userId" element={<UserProfilePage />} />
        </Route>

        <Route element={<BlankLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {background && user ? (
        <Routes>
          <Route path="/commentUpdate/:id" element={<ModalUpdateComment />} />
          <Route path="/postUpdate/:id" element={<ModalUpdatePost />} />
        </Routes>
      ) : (
        ""
      )}
    </>
  );
}

export default Router;
