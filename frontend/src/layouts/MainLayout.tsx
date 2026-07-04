import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Speech AI Platform
        </h1>
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
