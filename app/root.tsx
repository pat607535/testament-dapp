import { 
  isRouteErrorResponse, // Vérifie si une erreur vient d'une route inconnue
  Links,  // Permet d'insérer des balises <link> pour les styles, polices, etc.
  Meta,   // Gestion des balises <meta> pour le SEO et les métadonnées
  Outlet, // Composant qui permet d'afficher le contenu des sous-pages
  Scripts, // Charge les scripts nécessaires pour l'application
  ScrollRestoration // Gère la restauration automatique du scroll lors de la navigation
} from "react-router";

import Testament from "../src/components/Testament"; // Importation du composant principal qui interagit avec le contrat
import "./app.css"; // Importation des styles CSS

// Fonction qui définit les liens à inclure dans le <head> du document
export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" }, // Préchargement des polices Google pour améliorer la performance
];

// Composant de mise en page globale
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr"> {/* Définit la langue de la page en français */}
      <head>
        <meta charSet="utf-8" /> {/* Spécifie l'encodage des caractères */}
        <meta name="viewport" content="width=device-width, initial-scale=1" /> {/* Rend la page responsive */}
        <Meta /> {/* Injecte les balises <meta> définies ailleurs dans l'application */}
        <Links /> {/* Injecte les <link> pour les styles et polices */}
      </head>
      <body>
        {children} {/* Affiche le contenu de la page */}
        <ScrollRestoration /> {/* Garde la position du scroll lorsqu'on revient en arrière */}
        <Scripts /> {/* Charge les scripts nécessaires */}
      </body>
    </html>
  );
}

// Composant principal de l'application
export default function App() {
  return (
    <div className="App">
      <Testament /> {/* Intègre le composant Testament qui gère l'interaction avec Metamask et le contrat */}
    </div>
  );
}

// Gestion des erreurs globales dans l'application
export function ErrorBoundary({ error }: { error: any }) {
  let message = "Oops!"; // Message par défaut en cas d'erreur
  let details = "Une erreur inattendue est survenue."; // Détail de l'erreur
  let stack: string | undefined; // Stocke la pile d'erreur si elle est disponible

  // Gestion des erreurs de route (ex: si une page demandée n'existe pas)
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erreur"; // Si la page est introuvable, on affiche "404"
    details = error.status === 404 
      ? "La page demandée est introuvable." 
      : error.statusText || details; // Sinon, on affiche l'erreur retournée
  } 
  // Gestion des erreurs en mode développement pour afficher des détails plus précis
  else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message; // Récupère le message d'erreur
    stack = error.stack; // Récupère la stack pour le debugging
  }

  // Affichage des erreurs dans une page dédiée
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-red-600 font-bold text-2xl">{message}</h1> {/* Affiche le message d'erreur */}
      <p>{details}</p> {/* Affiche les détails de l'erreur */}

      {/* Si on est en mode développement et qu'une stack d'erreur est dispo, on l'affiche */}
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded">
          <code>{stack}</code> {/* Affichage du détail de l'erreur dans un format lisible */}
        </pre>
      )}
    </main>
  );
}
