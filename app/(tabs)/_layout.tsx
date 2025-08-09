import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import React from "react";

export default function TabLayout() {
  // const isAuthenticated = false; // Replace with actual authentication logic
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/sign-in" />;
  return <Slot />;
}
