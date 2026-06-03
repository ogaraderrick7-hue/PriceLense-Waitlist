import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PriceLense',
  description: 'Price tracking and margins optimization',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
