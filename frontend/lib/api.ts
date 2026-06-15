export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
export async function getDashboardSummary() {
  const response = await fetch(`${API_BASE_URL}/dashboard-summary`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard summary");
  }

  return response.json();
}

export async function askCampusOne(question: string) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to ask CampusOne");
  }

  return response.json();
}
export async function getLibraryBooks() {
  const response = await fetch(`${API_BASE_URL}/library/books`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch library books");
  }

  return response.json();
}
export async function getCafeterias() {
  const response = await fetch(`${API_BASE_URL}/cafeteria/list`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch cafeterias");
  }

  return response.json();
}
export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events/list`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function getAcademicsSummary() {
  const response = await fetch(`${API_BASE_URL}/academics/summary`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch academics summary");
  }

  return response.json();
}

export async function getNotices() {
  const response = await fetch(`${API_BASE_URL}/notices/list`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notices");
  }

  return response.json();
}