import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Login from "../pages/Login";
import { Outlet } from "react-router-dom";
import Loader from "../pages/Loader";
import { validateUser } from "../store/slices/authSlice";

export default function ProtectedLayout() {
  const {
    is_verified,
    initialized: authInitialized,
    loading,
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(validateUser());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }
  if (!is_verified) {
    return <Login />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
