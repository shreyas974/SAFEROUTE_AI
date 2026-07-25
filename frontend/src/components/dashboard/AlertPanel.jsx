import { getAlerts } from "../../services/alertService";

function AlertPanel() {
  const alerts = getAlerts();

  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="text-xl font-bold mb-4">
        Alerts
      </h2>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-xl border p-3"
          >
            <h3 className="font-semibold">
              {alert.title}
            </h3>

            <p className="text-sm">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertPanel;