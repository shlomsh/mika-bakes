import { useRegisterSW } from "virtual:pwa-register/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PWAReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      setTimeout(() => {
        toast("האפליקציה מוכנה לשימוש אופליין", { duration: 4000 });
      }, 100);
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast("גרסה חדשה זמינה", {
        action: {
          label: "עדכון",
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity,
      });
      setNeedRefresh(false);
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  return null;
}
