"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/fr";

type DatePickerProviderProps = {
  children: React.ReactNode;
};

export default function DatePickerProvider({
  children,
}: DatePickerProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      {children}
    </LocalizationProvider>
  );
}
