import { breadcrumbLabel as labelLoginPage } from "@/src/app/login/page";
import { breadcrumbLabel as labelSettingsPage } from "@/src/app/user-settings/page";
import { breadcrumbLabel as labelProfilPicturePage } from "@/src/app/profile-picture/page";
import { breadcrumbLabel as labelVideosPage } from "@/src/app/video/page";

/*Labels qui apparaitront dans le breadcrumb selon l'url*/
export const breadcrumbLabels: Record<string, string> = {
  "/user-settings": labelSettingsPage,
  "/login": labelLoginPage,
  "/profile-picture": labelProfilPicturePage,
  "/video": labelVideosPage,
};
