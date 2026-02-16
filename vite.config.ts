import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,woff2}"],
        globIgnores: ["uploads/**/*"],

        runtimeCaching: [
          // Google Fonts CSS (@font-face declarations)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: {
                maxEntries: 4,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          // Google Fonts webfont files (.woff2)
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Vercel Blob images (recipe photos)
          {
            urlPattern:
              /^https:\/\/.*\.public\.blob\.vercel-storage\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "vercel-blob-images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // API routes — network-first with offline fallback
          {
            urlPattern: /\/api\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-responses",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 5,
            },
          },
        ],

        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },

      manifest: {
        name: "ספר המתכונים של מיקה",
        short_name: "מתכוני מיקה",
        description:
          "האפליקציה הביתית של מיקה לכל מתכוני קינוחים, מאפים ובישולים!",
        lang: "he",
        dir: "rtl",
        theme_color: "#fdf2f0",
        background_color: "#fdf2f0",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait-primary",
        categories: ["food"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
