'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gender } from '@/types';

interface MainNavProps {
  gender: Gender;
}

export function MainNav({ gender }: MainNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Rankings Calculator',
      href: `/${gender}`,
      matchExact: true,
    },
    {
      name: 'Historical Rankings',
      href: `/${gender}/history`,
      matchExact: false,
    },
    {
      name: 'Raeburn Shield',
      href: `/${gender}/raeburn-shield`,
      matchExact: false,
    },
    {
      name: 'Tournaments',
      href: `/${gender}/tournaments`,
      matchExact: false,
    },
  ];

  const isActive = (href: string, matchExact: boolean) => {
    if (!pathname) return false;

    if (matchExact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex gap-1 overflow-x-auto pb-px -mb-px">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            isActive(item.href, item.matchExact)
              ? 'border-green-600 text-green-600 dark:border-green-500 dark:text-green-500'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
