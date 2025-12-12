import { useRef, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

type AlertVariant = 'default' | 'success' | 'danger' | 'info' | 'warning' | string;

type Alert = {
  id: number;
  timeout: ReturnType<typeof setTimeout>;
  variant: AlertVariant;
  title: string;
  message: string;
};

type AlertsContext = {
  alerts: Alert[];
  notify: (title: string, message: string, variant?: AlertVariant) => void;
  removeAlert: (id: number) => void;
};

const init: AlertsContext = {
  alerts: [],
  notify: () => undefined,
  removeAlert: () => undefined,
};

const useAlertsImpl = (): AlertsContext => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [idCount, setIdCount] = useState(0);
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  const removeAlert = (id: number) => {
    const existing = alertsRef.current.find((a) => a.id === id);
    if (existing) {
      clearTimeout(existing.timeout);
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const notify = (title: string, message: string, variant: AlertVariant = 'default') => {
    const newId = idCount;
    const alert: Alert = {
      id: newId,
      timeout: setTimeout(() => removeAlert(newId), 8000),
      variant,
      title,
      message,
    };
    setAlerts((prev) => prev.concat(alert));
    setIdCount((prev) => prev + 1);
  };

  return { alerts, notify, removeAlert };
};

export const useAlerts = singletonHook<AlertsContext>(init, useAlertsImpl);
