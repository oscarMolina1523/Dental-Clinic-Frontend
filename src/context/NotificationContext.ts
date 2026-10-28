
import { createContext } from "react";
import type { NotificationModel } from "../models/NotificationModel";

export interface NotificationContextType {
  notifications: NotificationModel[];

  addNotification: (
    notification: Omit<
      NotificationModel,
      "id" | "createdAt" | "read"
    > & {
      id?: string;
    }
  ) => string;

  removeNotification: (id: string) => void;

  updateNotification: (
    id: string,
    updates: Partial<Omit<NotificationModel, "id">>
  ) => void;

  markAsRead: (id: string) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;

  unreadCount: number;
}

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export default NotificationContext;
