import { useEffect, useState } from "react";

const STORAGE_KEY = "jansetu_projects_v1";

const demoProjects = [
  {
    id: "PRJ-101",
    name: "Drainage Improvement",
    ward: "Ward 14",
    category: "Drainage",
    budget: 250000,
    status: "In Progress",
    progress: 45,
  },
  {
    id: "PRJ-102",
    name: "Road Repair Near School",
    ward: "Ward 8",
    category: "Road",
    budget: 180000,
    status: "Planned",
    progress: 0,
  },
];

const emptyForm = {
  name: "",
  ward: "Ward 8",
  category: "Road",
  budget: "",
};

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not load projects:", error);
  }
  return demoProjects;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(loadProjects);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const filtered = projects.filter(
    (p) => filter === "All" || p.status === filter
  );

  function addProject(event) {
    event.preventDefault();
    if (!form.name.trim() || Number(form.budget) < 0) return;

    const project = {
      id: `PRJ-${Date.now()}`,
      name: form.name.trim(),
      ward: form.ward,
      category: form.category,
      budget: Number(form.budget),
      status: "Planned",
      progress: 0,
    };

    setProjects((previous) => [project, ...previous]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function updateStatus(id, status) {
    setProjects((previous) =>
      previous.map((project) =>
        project.id === id
          ? {
              ...project,
              status,
              progress:
                status === "Completed"
                  ? 100
                  : status === "Planned"
                  ? 0
                  : project.progress === 100
                  ? 50
                  : project.progress,
            }
          : project
      )
    );
  }

  const totalBudget = projects.reduce(
    (sum, project) => sum + project.budget,
    0
  );

  return (
    <section className="space-y-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Development Projects
          </h1>
          <p className="text-sm text-slate-500">
            Plan and monitor civic improvement projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
        >
          + Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Total Projects</p>
          <h2 className="text-3xl font-bold">{projects.length}</h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">In Progress</p>
          <h2 className="text-3xl font-bold">
            {projects.filter((p) => p.status === "In Progress").length}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <p className="text-sm text-slate-500">Total Budget</p>
          <h2 className="text-2xl font-bold">
            ₹{totalBudget.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Project List</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border p-2"
          >
            <option>All</option>
            <option>Planned</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Ward</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Progress</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((project) => (
                <tr key={project.id} className="border-b">
                  <td className="p-3">
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-xs text-slate-500">
                      {project.id} · {project.category}
                    </p>
                  </td>

                  <td className="p-3">{project.ward}</td>

                  <td className="p-3">
                    ₹{project.budget.toLocaleString("en-IN")}
                  </td>

                  <td className="min-w-28 p-3">
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs">{project.progress}%</span>
                  </td>

                  <td className="p-3">
                    <select
                      value={project.status}
                      onChange={(e) =>
                        updateStatus(project.id, e.target.value)
                      }
                      className="rounded-lg border p-2"
                    >
                      <option>Planned</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="p-5 text-center text-slate-500">
              No projects found.
            </p>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={addProject}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Project</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <input
              required
              placeholder="Project name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full rounded-lg border p-3"
            />

            <select
              value={form.ward}
              onChange={(e) =>
                setForm({ ...form, ward: e.target.value })
              }
              className="w-full rounded-lg border p-3"
            >
              <option>Ward 8</option>
              <option>Ward 14</option>
              <option>Ward 21</option>
            </select>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full rounded-lg border p-3"
            >
              <option>Road</option>
              <option>Drainage</option>
              <option>Streetlight</option>
              <option>Water Supply</option>
              <option>Sanitation</option>
            </select>

            <input
              type="number"
              min="0"
              required
              placeholder="Estimated budget (₹)"
              value={form.budget}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value })
              }
              className="w-full rounded-lg border p-3"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
            >
              Save Project
            </button>
          </form>
        </div>
      )}
    </section>
  );
}