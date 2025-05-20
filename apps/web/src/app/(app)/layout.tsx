import SignOut from '~/app/_components/signout';
import Link from 'next/link';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='px-4 py-2'>
        <nav className='w-full flex items-center justify-between gap-4'>
          <Link href='/challenges'>Antho</Link>
          <SignOut />
        </nav>
      </header>
      {children}
    </>
  );
}
