"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { getEvents } from "@/lib/api";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

type Event = {
  id: number;
  title: string;
  club: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  registrationLink: string;
};

const fallbackEvents: Event[] = [
  {
    id: 1,
    title: "Robotics Workshop",
    club: "MARS Club",
    type: "Tech",
    date: "2026-06-12",
    time: "4:00 PM",
    venue: "Main Auditorium",
    registrationLink: "#",
  },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data.results);
      } catch  {

            }
    }

    loadEvents();
  }, []);

  const techEvents = events.filter((event) => event.type === "Tech").length;
  const nextEvent = events[0];

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm font-medium text-purple-600">Events</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">
          Never miss what is happening on campus.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Track workshops, club activities, sports and cultural events happening
          around campus.
        </p>
      </header>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Upcoming Events</p>
          <h3 className="mt-2 text-3xl font-bold">{events.length}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tech Events</p>
          <h3 className="mt-2 text-3xl font-bold">{techEvents}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Next Event</p>
          <h3 className="mt-2 text-2xl font-bold">
            {nextEvent?.title || "Not available"}
          </h3>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <CalendarDays size={22} />
            </div>

            <h3 className="text-xl font-semibold">{event.title}</h3>

            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <Users size={14} />
              {event.club}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-purple-50 px-3 py-1 font-medium text-purple-700">
                {event.type}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                <Clock size={14} />
                {event.date}, {event.time}
              </span>

              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                <MapPin size={14} />
                {event.venue}
              </span>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
