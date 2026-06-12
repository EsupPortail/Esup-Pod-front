export interface AppConfig {
  USE_CAS?: boolean;
  VIDEO_LICENSE_CHOICES?: string[];
  [key: string]: unknown;
}

export interface AppInfo {
  project: string;
  version: string;
}
