import { Header } from '@/components/layout/Header';
import { Gender } from '@/types';
import { redirect } from 'next/navigation';

interface GenderLayoutProps {
  children: React.ReactNode;
  params: Promise<{ gender: string }>;
}

export default async function GenderLayout({
  children,
  params,
}: GenderLayoutProps) {
  const { gender } = await params;

  // Validate gender parameter
  if (gender !== 'men' && gender !== 'women') {
    redirect('/men');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header gender={gender as Gender} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Rankings calculation based on{" "}
          <a
            href="https://www.world.rugby/tournaments/rankings/explanation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            World Rugby methodology
          </a>
        </p>
        <p className="mt-2">
          Data from{" "}
          <a
            href="https://www.world.rugby/rankings"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            World Rugby
          </a>
          {" • "}
          Inspired by{" "}
          <a
            href="https://rawling.github.io/wr-calc/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            rawling/wr-calc
          </a>
        </p>
      </footer>
    </div>
  );
}
