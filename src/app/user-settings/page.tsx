import { redirect } from "next/navigation";

export default function UserSettingsRoot() {
  redirect("/user-settings/preferences");
}
