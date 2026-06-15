"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { getCafeterias } from "@/lib/api";
import { Coffee, Clock, Users, MapPin } from "lucide-react";

type Cafeteria = {
  id: number;
  name: string;
  area: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  crowdLevel: string;
  todayMenu: string[];
};

const fallbackCafeterias: Cafeteria[] = [
  {
    id: 1,
    name: "Main Cafeteria",
    area: "Academic Block",
    openingTime: "8:00 AM",
    closingTime: "8:00 PM",
    isOpen: true,
    crowdLevel: "High",
    todayMenu: ["Veg Thali", "Paneer Roll", "Cold Coffee"],
  },
];

export default function CafeteriaPage() {
  const [cafeterias, setCafeterias] = useState<Cafeteria[]>(fallbackCafeterias);

  useEffect(() => {
    async function loadCafeterias() {
      try {
        const data = await getCafeterias();
        setCafeterias(data.results);
      } catch  {
      }
    }

    loadCafeterias();
  }, []);

  const openCount = cafeterias.filter((cafe) => cafe.isOpen).length;
  const leastCrowded =
    cafeterias.find((cafe) => cafe.crowdLevel === "Low")?.name ||
    cafeterias[0]?.name ||
    "Not available";

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm font-medium text-orange-600">Cafeteria</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">
          Know where to eat before walking across campus.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Check today’s menu, opening hours and crowd levels before deciding
where to eat.
        </p>
      </header>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Open Now</p>
          <h3 className="mt-2 text-3xl font-bold">{openCount}</h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Least Crowded</p>
          <h3 className="mt-2 text-3xl font-bold">{leastCrowded}</h3>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Source</p>
          <h3 className="mt-2 text-2xl font-bold">Cafeteria Information</h3>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {cafeterias.map((cafe) => (
          <div
            key={cafe.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
              <Coffee size={22} />
            </div>

            <h3 className="text-xl font-semibold">{cafe.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={14} />
              {cafe.area}
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="flex items-center gap-2 text-slate-500">
                  <Clock size={15} />
                  Timing
                </span>
                <strong>
                  {cafe.openingTime} - {cafe.closingTime}
                </strong>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="flex items-center gap-2 text-slate-500">
                  <Users size={15} />
                  Crowd
                </span>
                <strong>{cafe.crowdLevel}</strong>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold">Today&apos;s menu</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cafe.todayMenu.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}