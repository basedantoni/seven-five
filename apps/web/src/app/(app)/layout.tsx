import SignOut from '~/app/_components/signout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='w-full flex items-center justify-between px-4 py-2'>
        <h1>Antho</h1>
        <SignOut />
      </header>
      {children}
    </>
  );
}
