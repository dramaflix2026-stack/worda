import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WORLDA | Conheça o mundo de perto',
  description: 'Explore destinos reais em viagens imersivas, com caminhos e histórias para descobrir.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
