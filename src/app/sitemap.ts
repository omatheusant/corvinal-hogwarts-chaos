import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { getStudents } from "@/lib/data/students";
import { getPosts } from "@/lib/data/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [{ data: students }, { data: posts }] = await Promise.all([getStudents(), getPosts()]);

  const staticRoutes = ["", "/a-casa", "/alunos", "/mural", "/memorias"].map((path) => ({
    url: `${base}${path}`,
  }));

  const studentRoutes = students.map((s) => ({ url: `${base}/alunos/${s.slug}` }));
  const postRoutes = posts.map((p) => ({ url: `${base}/mural/${p.slug}` }));

  return [...staticRoutes, ...studentRoutes, ...postRoutes];
}
