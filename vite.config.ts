import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(), // 🎨 Plugin pour TailwindCSS
    reactRouter(), // 🚀 Plugin pour React Router
    tsconfigPaths() // 📌 Support des alias TypeScript définis dans tsconfig.json
  ],

  build: {
    sourcemap: false, // 🚫 Désactivation des source maps pour éviter les erreurs inutiles
    minify: "esbuild", // ⚡ Optimisation du build avec esbuild
    target: "esnext" // 🎯 Cible les navigateurs récents pour de meilleures performances
  },

  server: {
    port: 5173, // 🔥 Démarre le serveur sur le port 5173
    open: true, // 🌍 Ouvre automatiquement le navigateur à http://localhost:5173
    strictPort: true, // ❌ Empêche le serveur de changer de port s'il est déjà utilisé
    watch: {
      usePolling: true, // 🔄 Améliore la détection des changements sous WSL ou Docker
    },
  },

  preview: {
    port: 5000, // 🔎 Port utilisé pour le mode "preview" (prévisualisation du build final)
    strictPort: true,
  },

  define: {
    __VITE_ENV__: JSON.stringify(process.env.NODE_ENV), // 🏗️ Définit l’environnement (dev, prod)
  },

  esbuild: {
    logLevel: "info", // 📜 Affiche les logs d'esbuild
  },
});

// ✅ Message de confirmation au démarrage
console.log("🚀 Vite est prêt ! Mode :", process.env.NODE_ENV);

