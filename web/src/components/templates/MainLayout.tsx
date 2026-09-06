import { ReactNode } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { client } from '@/lib/sanity';
import {
  FOOTER_SERVICES_QUERY,
  FOOTER_NEIGHBORHOODS_QUERY,
} from '@/lib/queries';

interface MainLayoutProps {
  children: ReactNode;
}

async function getFooterData() {
  const [services, neighborhoods] = await Promise.all([
    client.fetch(
      FOOTER_SERVICES_QUERY,
      {},
      { next: { tags: ['services'], revalidate: 3600 } }
    ),
    client.fetch(
      FOOTER_NEIGHBORHOODS_QUERY,
      {},
      { next: { tags: ['neighborhoods'], revalidate: 3600 } }
    ),
  ]);

  return { services, neighborhoods };
}

export async function MainLayout({ children }: MainLayoutProps) {
  const { services, neighborhoods } = await getFooterData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer services={services} neighborhoods={neighborhoods} />
    </div>
  );
}
