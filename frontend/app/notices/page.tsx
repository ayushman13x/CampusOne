"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { getNotices } from "@/lib/api";
import { AlertCircle, Bell, CalendarDays, Tag } from "lucide-react";

type Notice = {
  id: number;
  title: string;
  category: string;
  date: string;
  priority: string;
  description: string;
};

const fallbackNotices: Notice[] = [
  {
    id: 1,
    title: "Scholarship application deadline",
    category: "Deadline",
    date: "2026-06-12",
    priority: "High",
    description: "Students must submit the scholarship form before 5:00 PM.",
  },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(fallbackNotices);
  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getNotices();
        setNotices(data.results);
      } catch {
      }
    }

    loadNotices();
  }, []);

  const highPriorityCount = notices.filter(
    (notice) => notice.priority === "High",
  ).length;

  const upcomingDeadline =
    notices.find((notice) => notice.category === "Deadline")?.date ||
    "Not available";

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm font-medium text-rose-600">Notices</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">
          Important announcements without checking every group.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Keep track of important announcements, deadlines, maintenance updates
          and campus-wide alerts.
        </p>
      </header>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Active Notices</p>
          <h3 className="mt-2 text-3xl font-bold">{notices.length}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">High Priority</p>
          <h3 className="mt-2 text-3xl font-bold">{highPriorityCount}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Upcoming Deadline</p>
          <h3 className="mt-2 text-3xl font-bold">{upcomingDeadline}</h3>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
              <Bell size={22} />
            </div>

            <h3 className="text-xl font-semibold">{notice.title}</h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {notice.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                <Tag size={14} />
                {notice.category}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                <CalendarDays size={14} />
                {notice.date}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 font-medium text-rose-700">
                <AlertCircle size={14} />
                {notice.priority}
              </span>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
