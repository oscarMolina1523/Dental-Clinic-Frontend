
import React, { useCallback, useMemo, useState } from "react";
import NotificationContext from "./NotificationContext";
import type { NotificationModel } from "../models/NotificationModel";

type NewNotification = Omit<
  NotificationModel,
  "id" | "createdAt" | "read"
> & {
  id?: string;
};

const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<
    NotificationModel[]
  >([]);

  const addNotification = useCallback(
    (notification: NewNotification): string => {
      const id =
        notification.id ?? crypto.randomUUID();

      const newNotification: NotificationModel = {
        ...notification,
        id,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((current) => [
        newNotification,
        ...current.filter((item) => item.id !== id),
      ]);

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  }, []);

  const updateNotification = useCallback(
    (
      id: string,
      updates: Partial<Omit<NotificationModel, "id">>
    ) => {
      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, ...updates, id: item.id }
            : item
        )
      );
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        updateNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
