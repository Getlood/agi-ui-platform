import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AGI-UI Platform - Génération d\'Interfaces par IA',
  description: 'Plateforme révolutionnaire pour générer des interfaces utilisateur réactives en temps réel avec l\'IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              import '@agi-ui/components';
            `,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
