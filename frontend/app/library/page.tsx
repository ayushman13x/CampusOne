"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { getLibraryBooks } from "@/lib/api";
import { BookOpen, Search, MapPin, CheckCircle2, XCircle } from "lucide-react";

type Book = {
  id: number;
  title: string;
  author: string;
  topic: string;
  available: boolean;
  shelf: string;
};

const fallbackBooks: Book[] = [
  {
    id: 1,
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin",
    topic: "Computer Science",
    available: true,
    shelf: "CS-204",
  },
  {
    id: 2,
    title: "Database System Concepts",
    author: "Abraham Silberschatz",
    topic: "DBMS",
    available: false,
    shelf: "CS-118",
  },
];

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>(fallbackBooks);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getLibraryBooks();
        setBooks(data.results);
      } catch  {

            }
    }

    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.topic.toLowerCase().includes(query)
    );
  });

  const availableCount = books.filter((book) => book.available).length;

  return (
    <AppShell>
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">Library</p>
        <h2 className="mt-1 text-4xl font-bold tracking-tight">
          Find books without opening the old library portal.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
         Search books by title, author or topic and quickly check availability
before visiting the library.
        </p>
      </header>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Total Books</p>
          <h3 className="mt-2 text-3xl font-bold">{books.length}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Available Now</p>
          <h3 className="mt-2 text-3xl font-bold">{availableCount}</h3>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Source</p>
          <h3 className="mt-2 text-2xl font-bold">Library Catalogue</h3>
        </div>
      </section>

      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search by title, author, or topic..."
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {filteredBooks.map((book) => {
          const available = book.available;

          return (
            <div
              key={book.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <BookOpen size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{book.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {book.author}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    available
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {available ? "Available" : "Issued"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {book.topic}
                </span>

                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  <MapPin size={14} />
                  Shelf {book.shelf}
                </span>

                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  {available ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}
                  {available ? "Ready to borrow" : "Currently issued"}
                </span>
              </div>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}