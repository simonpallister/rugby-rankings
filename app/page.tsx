import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to men's rankings by default
  redirect('/men');
}
