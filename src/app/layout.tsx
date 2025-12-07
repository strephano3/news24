import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | NewsRisparmio24",
    default: "NewsRisparmio24 — Notizie e trucchi per risparmiare",
  },
  description:
    "Il bot editoriale che ogni giorno serve news su bonus, cashback e offerte legali per aiutarti a spendere meno.",
  metadataBase: new URL("https://newsrisparmio24.it"),
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={inter.className}>
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
        <footer className="mt-16 border-t border-slate-200 bg-white/80 py-8 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} NewsRisparmio24 — Tutti i diritti riservati.{' '}
            <a
              href="/privacy"
              className="text-brand-600 underline-offset-4 hover:underline"
            >
              Privacy & Cookie Policy
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
