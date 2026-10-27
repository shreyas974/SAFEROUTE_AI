import { getAlerts } from "../../services/alertService";
import { AlertTriangle, ShieldAlert, BellRing } from "lucide-react";

function AlertPanel() {
  const alerts = getAlerts();

  return (
    <div className="glass rounded-2xl p-5 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BellRing size={18} className="text-amber-400" />
          <h2 className="text-base font-bold text-white">Live City Alerts</h2>
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Bengaluru Real-Time
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isHigh = alert.level === "High";
          return (
            <div
              key={alert.id}
              className={`rounded-xl p-3 border transition-all ${
                isHigh
                  ? "bg-rose-500/10 border-rose-500/25 text-rose-200"
                  : "bg-amber-500/10 border-amber-500/25 text-amber-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  {isHigh ? (
                    <AlertTriangle size={14} className="text-rose-400" />
                  ) : (
                    <ShieldAlert size={14} className="text-amber-400" />
                  )}
                  <span>{alert.title}</span>
                </div>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                    isHigh ? "bg-rose-500/30 text-rose-200" : "bg-amber-500/30 text-amber-200"
                  }`}
                >
                  {alert.level}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlertPanel;