import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow proxied preview hosts (code-builder platform) to load dev resources.
  allowedDevOrigins: [
    "*.code-builder.platform.salesforce.com",
    "garden-t2fhqwps--3000.pdx.002.sf.code-builder.platform.salesforce.com",
  ],
};

export default nextConfig;
