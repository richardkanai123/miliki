import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */

	experimental: {
		useCache: true,
		// dynamicIO: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatar.iran.liara.run",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
};

export default nextConfig;
