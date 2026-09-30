"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLocale } from "next-intl";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import "dayjs/locale/es";

type DatePickerProviderProps = {
  children: React.ReactNode;
};

export default function DatePickerProvider({
  children,
}: DatePickerProviderProps) {
  const locale = useLocale();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  );
}
