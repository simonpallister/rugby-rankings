import Link from 'next/link';
import { GenderToggle } from './GenderToggle';
import { MainNav } from './MainNav';
import { Gender } from '@/types';

interface HeaderProps {
  gender: Gender;
}

export function Header({ gender }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${gender}`} className="flex items-center gap-2">
            <span className="text-2xl">🏉</span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              World Rugby Rankings
            </h1>
          </Link>

          {/* Gender Toggle */}
          <GenderToggle currentGender={gender} />
        </div>

        {/* Main Navigation */}
        <MainNav gender={gender} />
      </div>
    </header>
  );
}
