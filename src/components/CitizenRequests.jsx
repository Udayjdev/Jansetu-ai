import React, { useEffect, useMemo, useState } from "react";

// Hackathon MVP: browser-only persistence. Replace with Firestore for multi-user production use.
export const COMPLAINTS_STORAGE_KEY = "jansetu_citizen_requests_v1";
const seed = [
  { id: "JS-DEMO-101", text: "Main road has dangerous potholes near the school", category: "Road", ward: "Ward 8", priority: 86, status: "Pending", createdAt: "2026-10-12T10:00:00.000Z", source: "Demo" },
  { id: "JS-DEMO-102", text: "Drainage is blocked and water is entering houses", category: "Drainage", ward: "Ward 14", priority: 94, status: "In Progress", createdAt: "2026-10-13T09:00:00.000Z", source: "Demo" },
  { id: "JS-DEMO-103", text: "Streetlights not working on the market road", category: "Streetlight", ward: "Ward 21", priority: 62, status: "Resolved", createdAt: "2026-10-14T08:00:00.000Z", source: "Demo" },
];
const copy = {
  en: { title: "Citizen Requests", sub: "Track, prioritize and resolve civic complaints", total: "Total", pending: "Pending", progress: "In Progress", resolved: "Resolved", search: "Search by complaint, ward, category or ID", all: "All statuses", export: "Export CSV", complaint: "Complaint", category: "Category", ward: "Ward", priority: "AI Priority", status: "Status", action: "Action", details: "View details", close: "Close", date: "Submitted", source: "Source", empty: "No complaints match your search", note: "Demo records are examples. New reports are stored only in this browser.", update: "Update status", high: "High", medium: "Medium", low: "Low" },
  hi: { title: "नागरिक शिकायतें", sub: "नागरिक समस्याओं की स्थिति और प्राथमिकता देखें", total: "कुल", pending: "लंबित", progress: "कार्य जारी", resolved: "निस्तारित", search: "शिकायत, वार्ड, श्रेणी या आईडी खोजें", all: "सभी स्थितियाँ", export: "CSV डाउनलोड", complaint: "शिकायत", category: "श्रेणी", ward: "वार्ड", priority: "AI प्राथमिकता", status: "स्थिति", action: "विवरण", details: "विवरण देखें", close: "बंद करें", date: "दर्ज तारीख", source: "स्रोत", empty: "कोई शिकायत नहीं मिली", note: "उदाहरण रिकॉर्ड डेमो के लिए हैं। नई शिकायतें केवल इसी ब्राउज़र में सहेजी जाती हैं।", update: "स्थिति बदलें", high: "उच्च", medium: "मध्यम", low: "कम" },
};
function readComplaints() {
  try {
    const raw = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    if (raw !== null) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed; }
  } catch (e) { console.warn("Could not read saved complaints", e); }
  return seed;
}
function priorityValue(item) {
  const n = Number(item.priority ?? item.priorityScore ?? item.score ?? 50);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50;
}
function statusName(status, hi) {
  const s = status || "Pending";
  return hi ? ({ "Pending": "लंबित", "In Progress": "कार्य जारी", "Resolved": "निस्तारित" }[s] || s) : s;
}
function dateText(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}
function csvCell(value) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }
export default function CitizenRequests({ language = "en" }) {
  const hi = language === "hi" || language === "Hindi";
  const t = hi ? copy.hi : copy.en;
  const [items, setItems] = useState(readComplaints);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    const refresh = () => setItems(readComplaints());
    window.addEventListener("storage", refresh);
    window.addEventListener("jansetu:complaints-updated", refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener("jansetu:complaints-updated", refresh); };
  }, []);
  const filtered = useMemo(() => items.filter(item => {
    const text = [item.id, item.text, item.description, item.category, item.ward].join(" ").toLowerCase();
    return text.includes(query.toLowerCase()) && (statusFilter === "All" || (item.status || "Pending") === statusFilter);
  }), [items, query, statusFilter]);
  const selected = items.find(item => item.id === selectedId);
  function updateStatus(id, status) {
    const next = items.map(item => item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item);
    setItems(next);
    try { localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(next)); } catch (e) { console.error("Unable to save status", e); }
  }
  function exportCSV() {
    const fields = ["id", "text", "category", "ward", "priority", "status", "createdAt", "source"];
    const lines = [fields.join(","), ...filtered.map(item => fields.map(key => csvCell(key === "priority" ? priorityValue(item) : key === "text" ? (item.text || item.description) : item[key])).join(","))];
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "jansetu-complaints.csv"; a.click(); URL.revokeObjectURL(url);
  }
  const stats = [
    { name: t.total, value: items.length },
    { name: t.pending, value: items.filter(i => !i.status || i.status === "Pending").length },
    { name: t.progress, value: items.filter(i => i.status === "In Progress").length },
    { name: t.resolved, value: items.filter(i => i.status === "Resolved").length },
  ];
  return (
    <section className="w-full p-4 md:p-7 text-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div><h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1><p className="text-slate-500 mt-1">{t.sub}</p></div>
        <button type="button" onClick={exportCSV} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold">↓ {t.export}</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(stat => <div key={stat.name} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm"><div className="text-sm text-slate-500">{stat.name}</div><div className="text-3xl font-bold mt-1">{stat.value}</div></div>)}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col md:flex-row gap-3">
          <input aria-label={t.search} className="flex-1 border border-slate-300 rounded-xl px-4 py-3 min-w-0" placeholder={t.search} value={query} onChange={e => setQuery(e.target.value)} />
          <select aria-label={t.status} className="border border-slate-300 rounded-xl px-4 py-3 bg-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">{t.all}</option><option value="Pending">{t.pending}</option><option value="In Progress">{t.progress}</option><option value="Resolved">{t.resolved}</option>
          </select>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w- [760px] text-sm text-left"><thead className="bg-slate-50 text-slate-600"><tr>{["ID", t.complaint, t.category, t.ward, t.priority, t.status, t.action].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>
          {filtered.map(item => <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50"><td className="px-4 py-4 font-semibold text-blue-700">{item.id}</td><td className="px-4 py-4 max-w- [260px] truncate" title={item.text || item.description}>{item.text || item.description || "—"}</td><td className="px-4 py-4">{item.category || "General"}</td><td className="px-4 py-4">{item.ward || "—"}</td><td className="px-4 py-4"><span className={`font-bold ${priorityValue(item) >= 80 ? "text-red-600" : priorityValue(item) >= 50 ? "text-amber-600" : "text-green-700"}`}>{priorityValue(item)}/100</span></td><td className="px-4 py-4">{statusName(item.status, hi)}</td><td className="px-4 py-4"><button type="button" className="text-blue-700 font-semibold hover:underline" onClick={() => setSelectedId(item.id)}>{t.details}</button></td></tr>)}
          {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">{t.empty}</td></tr>}
        </tbody></table></div>
      </div>
      <p className="text-xs text-slate-500 mt-3">{t.note}</p>
      {selected && <div className="fixed inset-0 z- [100] bg-slate-950/60 flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
        <div role="dialog" aria-modal="true" aria-label={t.details} className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-start gap-3 mb-4"><div><p className="text-blue-700 font-semibold">{selected.id}</p><h2 className="text-xl font-bold mt-1">{t.details}</h2></div><button type="button" aria-label={t.close} onClick={() => setSelectedId(null)} className="text-2xl text-slate-600">×</button></div>
          <p className="rounded-xl bg-slate-50 p-4 whitespace-pre-wrap">{selected.text || selected.description || "—"}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mt-5"><div><span className="text-slate-500">{t.category}</span><p className="font-semibold">{selected.category || "General"}</p></div><div><span className="text-slate-500">{t.ward}</span><p className="font-semibold">{selected.ward || "—"}</p></div><div><span className="text-slate-500">{t.priority}</span><p className="font-semibold">{priorityValue(selected)}/100</p></div><div><span className="text-slate-500">{t.date}</span><p className="font-semibold">{dateText(selected.createdAt)}</p></div><div><span className="text-slate-500">{t.source}</span><p className="font-semibold">{selected.source || "Citizen"}</p></div></div>
          <label className="block text-sm font-semibold mt-5 mb-2" htmlFor="request-status">{t.update}</label><select id="request-status" value={selected.status || "Pending"} onChange={e => updateStatus(selected.id, e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-3 bg-white"><option value="Pending">{t.pending}</option><option value="In Progress">{t.progress}</option><option value="Resolved">{t.resolved}</option></select>
          <button type="button" className="w-full bg-slate-900 text-white rounded-xl py-3 mt-5" onClick={() => setSelectedId(null)}>{t.close}</button>
        </div>
      </div>}
    </section>
  );
}
