import { breadcrumbLabel as labelLoginPage } from "@/src/app/login/page";
import { breadcrumbLabel as labelSettingsPage } from "@/src/app/user-settings/page";
import { breadcrumbLabel as labelProfilPicturePage } from "@/src/app/profile-picture/page";
import { breadcrumbLabel as labelVideosPage } from "@/src/app/video/page";
import { breadcrumbLabel as labelAddVideosPage } from "@/src/app/video/add/page";
import { breadcrumbLabel as labelEditVideosPage } from "@/src/app/video/edit/[slug]/page";
import { breadcrumbLabel as labelDashboard } from "@/src/app/dashboard/page";
import { breadcrumbLabel as labelDeleteVideoPage } from "@/src/app/video/delete/[slug]/page";

/*Labels qui apparaitront dans le breadcrumb selon l'url*/
export const breadcrumbLabels: Record<string, string> = {
  "/user-settings": labelSettingsPage,
  "/login": labelLoginPage,
  "/profile-picture": labelProfilPicturePage,
  "/video": labelVideosPage,
  "/video/add": labelAddVideosPage,
  "/video/edit": labelEditVideosPage,
  "/dashboard": labelDashboard,
  "/video/delete": labelDeleteVideoPage,
};
