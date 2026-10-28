
export type NotificationType =
  | "success"
  | "info"
  | "warning"
  | "error";

export interface NotificationModel {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;

  // Modelo relacionado con la notificación, si aplica.
  entityType?: string;
  entityId?: string | number;

  // Ruta opcional para navegar al detalle relacionado.
  actionUrl?: string;
}
