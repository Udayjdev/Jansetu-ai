import { useEffect, useState } from "react";

const SETTINGS_KEY = "jansetu_settings_v1";

const defaultSettings = {
  notifications: true,
  criticalAlerts: true,
  mapZoom: 13,
};

export default function SettingsPage({ lang, onLangChange }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SETTINGS_KEY) || "{}"
      );
      return { ...defaultSettings, ...saved };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  }, [settings]);

  const isHindi = lang === "Hindi";

  function updateSetting(key, value) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  return (
    <section className="space-y-6 p-5">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">
          {isHindi ? "सूचनाएँ" : "Notifications"}
        </h2>

        <label className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              updateSetting("notifications", e.target.checked)
            }
          />
          <span>
            {isHindi
              ? "डैशबोर्ड सूचनाएँ चालू करें"
              : "Enable dashboard notifications"}
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.criticalAlerts}
            onChange={(e) =>
              updateSetting("criticalAlerts", e.target.checked)
            }
          />
          <span>
            {isHindi
              ? "गंभीर शिकायत अलर्ट चालू करें"
              : "Enable critical complaint alerts"}
          </span>
        </label>

        <p className="mt-3 text-xs text-slate-500">
          These preferences are saved locally. Notification delivery
          requires integration with an alert system.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">
          {isHindi ? "मैप सेटिंग्स" : "Map Settings"}
        </h2>

        <label className="mb-2 block text-sm font-medium">
          {isHindi ? "डिफ़ॉल्ट ज़ूम" : "Default Map Zoom"}
        </label>

        <select
          value={settings.mapZoom}
          onChange={(e) =>
            updateSetting("mapZoom", Number(e.target.value))
          }
          className="w-full max-w-xs rounded-lg border p-3"
        >
          <option value={11}>District View</option>
          <option value={13}>City View</option>
          <option value={15}>Street View</option>
        </select>

        <p className="mt-3 text-xs text-slate-500">
          The selected zoom is saved. Connect it to FreePriorityMap
          to apply it to the map.
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold">
          {isHindi ? "डेटा प्रबंधन" : "Data Management"}
        </h2>

        <p className="mb-4 text-sm text-slate-500">
          Citizen requests and projects are stored locally in this
          browser for the hackathon prototype.
        </p>

        <button
          type="button"
          onClick={() => {
            const data = {
              complaints: JSON.parse(
                localStorage.getItem(
                  "jansetu_citizen_requests_v1"
                ) || "[]"
              ),
              projects: JSON.parse(
                localStorage.getItem(
                  "jansetu_projects_v1"
                ) || "[]"
              ),
              exportedAt: new Date().toISOString(),
            };

            const blob = new Blob(
              [JSON.stringify(data, null, 2)],
              { type: "application/json" }
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "jansetu-backup.json";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
        >
          Export Project Data
        </button>
      </div>
    </section>
  );
}