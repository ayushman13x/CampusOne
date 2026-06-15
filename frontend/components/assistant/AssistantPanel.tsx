"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

type AssistantApiResponse = {
  answer?: string;
  sourceUsed?: string;
};

type AssistantResponse = {
  answer: string;
  sourceUsed: string;
};

const sampleQuestions = [
  "Suggest books for machine learning",
  "What is today's lunch menu?",
  "When is robotics workshop?",
  "What is the attendance rule?",
  "Any scholarship deadline?",
];

export default function AssistantPanel() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function askCampusOne(selectedQuestion?: string) {
    const finalQuestion = selectedQuestion || question;

    if (!finalQuestion.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: finalQuestion }),
      });

      const data = (await res.json()) as AssistantApiResponse;

      if (!res.ok) {
        throw new Error("CampusOne could not process this question right now.");
      }

      setResponse({
        answer: data.answer || "No answer was returned from CampusOne.",
        sourceUsed: (data.sourceUsed || "Campus source").replace(" MCP", ""),
      });

      setQuestion(finalQuestion);
    } catch {
      setResponse({
        answer: "CampusOne could not process this question right now.",
        sourceUsed: "CampusOne",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={20} />
        <h3 className="text-lg font-semibold">Ask CampusOne</h3>
      </div>

      <p className="max-w-2xl text-sm leading-6 text-slate-300">
        Ask a campus question. CampusOne uses Gemini to choose the right source
        and answers using live campus data.
      </p>

      <div className="mt-5 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askCampusOne();
          }}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
          placeholder="Ask about books, menu, events..."
        />

        <button
          onClick={() => askCampusOne()}
          disabled={loading}
          className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
          aria-label="Ask CampusOne"
        >
          <Send size={18} />
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => askCampusOne(q)}
            className="rounded-2xl bg-white/10 p-3 text-left text-xs text-slate-200 hover:bg-white/15"
          >
            {q}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-slate-300">
          Reading your question and checking the right campus source...
        </div>
      )}

      {response && (
        <div className="mt-5 rounded-3xl bg-white p-5 text-slate-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Answer
          </p>

          <p className="mt-2 text-sm leading-6">{response.answer}</p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Source
            </p>
            <p className="mt-1 text-sm font-semibold text-blue-700">
              {response.sourceUsed}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}