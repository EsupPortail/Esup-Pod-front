import type { Metadata } from "next";
import DashboardClientPage from "./DashboardClientPage";

const t = (key: string) => {
  const translations: Record<string, string> = {
    "common.tab": "Dashboard",
    "descriptions.dashboard":
      "Manage your videos and settings on your Esup-Pod dashboard.",
  };
  return translations[key] || key;
};

export const metadata: Metadata = {
  title: `${t("common.tab")} - Esup-Pod`,
  description: t("descriptions.dashboard"),
};

export default function Page() {
  return <DashboardClientPage />;
}
