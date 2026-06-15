"use client";

import { useEffect, useState, type ElementType } from "react";
import AppShell from "@/components/layout/AppShell";
import AssistantPanel from "@/components/assistant/AssistantPanel";
import { getDashboardSummary } from "@/lib/api";

import {
  Bell,
  BookOpen,
  CalendarDays,
  Coffee,
  GraduationCap,
  TrendingUp,
  Clock,
} from "lucide-react";

type DashboardCard = {
  title: string;
  value: string;
  detail: string;
  icon: ElementType;
  color: string;
};

type TimelineItem = {
  time: string;
  title: string;
};

type DashboardSummary = {
  cards: {
    library: {
      availableBooks: number;
      totalBooks: number;
    };
    cafeteria: {
      openNow: number;
      leastCrowded: string;
    };
    events: {
      upcoming: number;
      nextEvent: {
        title: string;
        time: string;
      };
    };
    academics: {
      nextExam: {
        subject: string;
        date: string;
      };
    };
    notices: {
      active: number;
      important: {
        title: string;
      };
    };
  };
  pulse: string[];
  timeline: TimelineItem[];
};

const cards: DashboardCard[] = [
  {
    title: "Library",
    value: "1,248 books",
    detail: "Most searched: Machine Learning",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Cafeteria",
    value: "3 open now",
    detail: "Library Café has low crowd",
    icon: Coffee,
    color: "bg-orange-50 text-orange-700",
  },
  {
    title: "Events",
    value: "8 upcoming",
    detail: "Robotics Workshop at 4 PM",
    icon: CalendarDays,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Academics",
    value: "DBMS exam",
    detail: "Scheduled on 18 June",
    icon: GraduationCap,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Notices",
    value: "5 active",
    detail: "Scholarship deadline in 2 days",
    icon: Bell,
    color: "bg-rose-50 text-rose-700",
  },
];

const pulse: string[] = [
  "Robotics Workshop is trending today",
  "Machine Learning books are highly searched",
  "Main Cafeteria is crowded right now",
  "Scholarship form closes in 2 days",
];

const defaultTimeline: TimelineItem[] = [
  {
    time: "12:30 PM",
    title: "Lunch menu updated",
  },
  {
    time: "4:00 PM",
    title: "Robotics Workshop",
  },
  {
    time: "Today",
    title: "Scholarship notice active",
  },
];

export default function Home() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = (await getDashboardSummary()) as DashboardSummary;
        setSummary(data);
      } catch {
        setSummaryError(
          "Dashboard summary is temporarily unavailable. Showing saved campus highlights.",
        );
      }
    }

    loadSummary();
  }, []);

  const dashboardCards: DashboardCard[] = summary
    ? [
        {
          title: "Library",
          value: `${summary.cards.library.availableBooks} available`,
          detail: `${summary.cards.library.totalBooks} books indexed`,
          icon: BookOpen,
          color: "bg-blue-50 text-blue-700",
        },
        {
          title: "Cafeteria",
          value: `${summary.cards.cafeteria.openNow} open now`,
          detail: `${summary.cards.cafeteria.leastCrowded} has low crowd`,
          icon: Coffee,
          color: "bg-orange-50 text-orange-700",
        },
        {
          title: "Events",
          value: `${summary.cards.events.upcoming} upcoming`,
          detail: `${summary.cards.events.nextEvent.title} at ${summary.cards.events.nextEvent.time}`,
          icon: CalendarDays,
          color: "bg-purple-50 text-purple-700",
        },
        {
          title: "Academics",
          value: summary.cards.academics.nextExam.subject,
          detail: `Exam on ${summary.cards.academics.nextExam.date}`,
          icon: GraduationCap,
          color: "bg-emerald-50 text-emerald-700",
        },
        {
          title: "Notices",
          value: `${summary.cards.notices.active} active`,
          detail: summary.cards.notices.important.title,
          icon: Bell,
          color: "bg-rose-50 text-rose-700",
        },
      ]
    : cards;

  const dashboardPulse: string[] = summary ? summary.pulse : pulse;
  const dashboardTimeline: TimelineItem[] = summary
    ? summary.timeline
    : defaultTimeline;

  return (
    <AppShell>
      <header className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium text-blue-600">Hey, Buddy 👋</p>

          <h2 className="mt-1 text-4xl font-bold tracking-tight">
            Here&apos;s what&apos;s happening around campus today.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            CampusOne brings library updates, cafeteria status, events,
            academics and notices into one clean dashboard.
          </p>

          {summaryError && (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {summaryError}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Live Sources</p>
          <p className="mt-1 text-sm text-slate-500">
            Library · Cafeteria · Events · Academics · Notices
          </p>
        </div>
      </header>

      <section className="mb-6 grid items-start gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold">Campus Pulse</h3>
          </div>

          <div className="grid gap-3">
            {dashboardPulse.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <AssistantPanel />
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {dashboardCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="min-h-[190px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}
              >
                <Icon size={22} />
              </div>

              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-xl font-bold leading-tight">
                {card.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.detail}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Clock size={19} className="text-slate-500" />
            <h3 className="text-lg font-semibold">Today&apos;s timeline</h3>
          </div>

          <div className="space-y-4 text-sm">
            {dashboardTimeline.map((item) => (
              <div
                key={`${item.time}-${item.title}`}
                className="flex justify-between rounded-2xl bg-slate-50 p-4"
              >
                <span>{item.time}</span>
                <strong>{item.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}