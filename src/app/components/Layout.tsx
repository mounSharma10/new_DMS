import { Outlet } from 'react-router';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F6F8FB] dark:bg-slate-950 font-sans">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
