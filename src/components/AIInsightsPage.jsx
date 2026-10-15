import { useEffect, useState } from "react";

const STORAGE_KEY = "jansetu_citizen_requests_v1";

const sampleComplaints = [
  { id: "DEMO-1", text: "Drainage blocked after rainfall", category: "Drainage", ward: "Ward 14", priority: 94, status: "Pending" },
  { id: "DEMO-2", text: "Dangerous potholes near school", category: "Road", ward: "Ward 8", priority: 86, status: "In Progress" },
  { id: "DEMO-3", text: "Streetlights not working", category: "Streetlight", ward: "Ward 21", priority: 62, status: "Resolved" },
];

function loadComplaints() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(stored) && stored.length > 0) {
      return stored;
    }
  } catch (error) {
    console.error("Unable to read complaints:", error);
  }

  return sampleComplaints;
}

function normalizeComplaint(item) {
  const rawScore = Number(item.priority ?? item.score ?? 50);

  return {
    ...item,
    text: item.text ?? item.issue ?? item.title ?? "Civic issue",
    category: item.category ?? "Other",
    ward: item.ward ?? "Unknown ward",
    priority: Math.max(0, Math.min(100, Number.isFinite(rawScore) ? rawScore : 50)),
  };
}

export default function AIInsightsPage() {
  const [complaints, setComplaints] = useState(() =>
    loadComplaints().map(normalizeComplaint)
  );

  useEffect(() => {
    function refresh() {
      setComplaints(loadComplaints().map(normalizeComplaint));
    }

    window.addEventListener("storage", refresh);
    window.addEventListener("jansetu:complaints-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("jansetu:complaints-updated", refresh);
    };
  }, []);

  const critical = complaints.filter((c) => c.priority >= 90);
  const high = complaints.filter(
    (c) => c.priority >= 75 && c.priority < 90
  );

  const average = complaints.length
    ? Math.round(
        complaints.reduce((sum, c) => sum + c.priority, 0) /
          complaints.length
      )
    : 0;

  const categories = Object.entries(
    complaints.reduce((result, item) => {
      const category = item.category;
      result[category] = (result[category] || 0) + 1;
      return result;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const topIssues = [...complaints]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  function recommendation(item) {
    const category = item.category.toLowerCase();

    if (category.includes("drain")) {
      return "Inspect drainage capacity and prioritize clearing blockages.";
    }
    if (category.includes("road")) {
      return "Schedule road inspection and repair hazardous potholes.";
    }
    if (category.includes("light")) {
      return "Inspect faulty streetlights and restore lighting.";
    }
    if (category.includes("water")) {
      return "Inspect water supply infrastructure and verify service disruption.";
    }

    return "Verify the complaint and assign it to the responsible department.";
  }

  return (
    <section className="space-y-6 p-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI Insights & Recommendations
        </h1>
        <p className="text-sm text-slate-500">
          Data-driven analysis of civic complaints and development needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ["Total Complaints", complaints.length],
          ["Critical Issues", critical.length],
          ["High Priority", high.length],
          ["Average Priority", `${average}/100`],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">
            Complaint Categories
          </h2>

          {categories.map(([name, count]) => (
            <div key={name} className="mb-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>{name}</span>
                <span>{count}</span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-blue-500"
                  style={{
                    width: `${(count / complaints.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-bold">
            Priority Distribution
          </h2>

          {[
            ["Critical (90–100)", critical.length, "bg-red-500"],
            ["High (75–89)", high.length, "bg-orange-500"],
            [
              "Normal (0–74)",
              complaints.length - critical.length - high.length,
              "bg-green-500",
            ],
          ].map(([label, count, color]) => (
            <div key={label} className="mb-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>{label}</span>
                <span>{count}</span>
              </div>

              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${color}`}
                  style={{
                    width: complaints.length
                      ? `${(count / complaints.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">
          Priority Recommendations
        </h2>

        <div className="space-y-4">
          {topIssues.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{item.text}</h3>
                  <p className="text-sm text-slate-500">
                    {item.ward} · {item.category}
                  </p>
                </div>

                <span className="font-bold text-red-600">
                  {item.priority}/100
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-700">
                <strong>Suggested action:</strong>{" "}
                {recommendation(item)}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Priority ranking is based on the stored complaint score.
                Recommendations use category-based rules.
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        When no saved complaints exist, sample records are displayed.
        This page summarizes stored priority scores; it does not
        independently run a new AI model.
      </p>
    </section>
  );
}