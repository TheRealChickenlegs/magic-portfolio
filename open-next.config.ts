import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
	...defineCloudflareConfig(),
	buildCommand: "node scripts/generate-content-data.mjs && next build",
};