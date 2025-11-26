'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gender } from '@/types';

interface GenderToggleProps {
  currentGender: Gender;
}

export function GenderToggle({ currentGender }: GenderToggleProps) {
  const pathname = usePathname();

  // Calculate the opposite gender's URL by replacing the gender segment
  const getOppositeGenderUrl = () => {
    if (!pathname) return currentGender === 'men' ? '/women' : '/men';

    const oppositeGender = currentGender === 'men' ? 'women' : 'men';
    // Replace /men/ or /women/ at the start of the path
    return pathname.replace(`/${currentGender}`, `/${oppositeGender}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
      <Link
        href={currentGender === 'men' ? `/${currentGender}` : getOppositeGenderUrl()}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentGender === 'men'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Men
      </Link>
      <Link
        href={currentGender === 'women' ? `/${currentGender}` : getOppositeGenderUrl()}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentGender === 'women'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Women
      </Link>
    </div>
  );
}
