import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const sources = [
  ["src/app/blog/posts", ["src", "app", "blog", "posts"]],
  ["src/app/work/projects", ["src", "app", "work", "projects"]],
];

const contentData = {};

for (const [relativeDirectory, key] of sources) {
  const directory = path.join(root, relativeDirectory);
  const posts = fs
    .readdirSync(directory)
    .filter((file) => path.extname(file) === ".mdx")
    .map((file) => {
      const filePath = path.join(directory, file);
      const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

      return {
        metadata: {
          title: data.title || "",
          subtitle: data.subtitle || "",
          publishedAt: data.publishedAt,
          summary: data.summary || "",
          image: data.image || "",
          images: data.images || [],
          tag: Array.isArray(data.tag) ? data.tag.join(", ") : data.tag || "",
          team: data.team || [],
          link: data.link || "",
        },
        slug: path.basename(file, ".mdx"),
        content,
      };
    });

  contentData[key.join("/")] = posts;
}

const output = `export type ContentPost = {\n  metadata: {\n    title: string;\n    subtitle?: string;\n    publishedAt: string;\n    summary: string;\n    image?: string;\n    images: string[];\n    tag?: string;\n    team: { name: string; role: string; avatar: string; linkedIn: string }[];\n    link?: string;\n  };\n  slug: string;\n  content: string;\n};\n\nexport const contentData: Record<string, ContentPost[]> = ${JSON.stringify(contentData)};\n`;
fs.writeFileSync(path.join(root, "src/resources/content-data.ts"), output);