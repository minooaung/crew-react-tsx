import { Outlet } from "react-router-dom";
import Banner from "./Banner";

export default function GuestLayout(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Banner />
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
} 