import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Pulsar — Encuentra tu frecuencia", description: "Una red social de afinidades. Emite pulsos, encuentra resonancias." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}