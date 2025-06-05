import SignOut from '~/app/_components/signout';
import RootCrumbClient from '~/app/_components/root-crumb-client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='px-4 py-2'>
        <nav className='w-full flex items-center justify-between gap-4'>
          <RootCrumbClient />
          <SignOut />
        </nav>
      </header>
      {children}
    </>
  );
}
