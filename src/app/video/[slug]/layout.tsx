import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string | string[] }> }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BACK_URL ?? "http://pod.localhost:8000/";
  const url = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  
  try {
    const resolvedParams = await params;
    const slug = Array.isArray(resolvedParams.slug) ? resolvedParams.slug[0] : resolvedParams.slug;
    const res = await fetch(`${url}api/videos/${slug}/`);
    if (res.ok) {
      const video = await res.json();
      return {
        title: `${video.title} | Esup POD`,
        description: video.description || "Regarder la vidéo sur Esup POD",
      };
    }
  } catch (error) {
    // fallback
  }

  return {
    title: "Vidéo | Esup POD",
  };
}

export default function VideoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
