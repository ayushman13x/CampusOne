"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Coffee,
  CalendarDays,
  GraduationCap,
  Bell,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Cafeteria", href: "/cafeteria", icon: Coffee },
  { name: "Events", href: "/events", icon: CalendarDays },
  { name: "Academics", href: "/academics", icon: GraduationCap },
  { name: "Notices", href: "/notices", icon: Bell },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <div className="flex">
        <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-6 py-7 lg:block">
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight">CampusOne</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your campus in one place
            </p>
          </div>

          <nav className="space-y-2 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-slate-950 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 px-6 py-7 lg:px-10">{children}</section>
      </div>
    </main>
  );
}