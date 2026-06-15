"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { getAcademicsSummary } from "@/lib/api";
import { BookMarked, CalendarClock, FileText } from "lucide-react";

type Exam = {
  subject: string;
  code: string;
  date: string;
  time: string;
  venue: string;
};

type Syllabus = {
  subject: string;
  code: string;
  units: string[];
};

type Attendance = {
  minimumRequired: string;
  description: string;
  shortageRule: string;
};

export default function AcademicsPage() {
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [syllabus, setSyllabus] = useState<Syllabus[]>([]);

  useEffect(() => {
    async function loadAcademics() {
      try {
        const data = await getAcademicsSummary();
        setAttendance(data.attendance);
        setExams(data.exams);
        setSyllabus(data.syllabus);
      } catch  {
        setAttendance({
          minimumRequired: "75%",
          description:
            "Students must maintain at least 75% attendance in each subject.",
          shortageRule:
            "Students below 75% may need medical or official approval.",
        });
        setExams([
          {
            subject: "Database Management Systems",
            code: "CS304",
            date: "2026-06-18",
            time: "10:00 AM - 1:00 PM",
            venue: "Block A, Room 204",
          },
        ]);
        setSyllabus([
          {
            subject: "Database Management Systems",
            code: "CS304",
            units: ["ER model", "SQL", "Normalization", "Transactions"],
          },
        ]);
      }
    }

    loadAcademics();
  }, []);

  const nextExam = exams[0];

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm font-medium text-emerald-600">Academics</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">
          Syllabus, exams and policies in one place.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Check exam schedules, attendance rules and syllabus details without
          searching through multiple academic notices.
        </p>
      </header>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Next Exam</p>
          <h3 className="mt-2 text-2xl font-bold">
            {nextExam?.subject || "Not available"}
          </h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Exam Date</p>
          <h3 className="mt-2 text-3xl font-bold">{nextExam?.date || "N/A"}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Attendance Rule</p>
          <h3 className="mt-2 text-3xl font-bold">
            {attendance?.minimumRequired || "75%"}
          </h3>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <CalendarClock size={20} className="text-emerald-700" />
            <h3 className="text-lg font-semibold">Exam Schedule</h3>
          </div>

          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.code} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{exam.subject}</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {exam.code} · {exam.time} · {exam.venue}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {exam.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <FileText size={20} className="text-emerald-700" />
            <h3 className="text-lg font-semibold">Academic Policies</h3>
          </div>

         <div className="space-y-3">
  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
    <p className="font-semibold text-slate-900">Minimum attendance</p>
    <p className="mt-1 leading-6 text-slate-600">
      {attendance?.description}
    </p>
  </div>

  <div className="rounded-2xl bg-slate-50 p-4 text-sm">
    <p className="font-semibold text-slate-900">Shortage rule</p>
    <p className="mt-1 leading-6 text-slate-600">
      {attendance?.shortageRule}
    </p>
  </div>
</div>

          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            <BookMarked className="mb-2" size={18} />
            {syllabus.length} syllabus records available.
          </div>
        </div>
      </section>
    </AppShell>
  );
}
