import type { Notification } from "../models/types"

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "student1",
    title: "Application Status Update",
    message: "Your application to MIT Computer Science program has been reviewed.",
    read: false,
    createdAt: new Date().toISOString(),
    type: "application",
  },
  {
    id: "2",
    userId: "student1",
    title: "Document Verification",
    message: "Your transcript has been verified successfully.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    type: "document",
  },
  {
    id: "3",
    userId: "institution1",
    title: "New Application",
    message: "A new student has applied to your Computer Science program.",
    read: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    type: "application",
  },
]

// Get notifications for a specific user
export const getUserNotifications = (userId: string): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userNotifications = mockNotifications.filter((notification) => notification.userId === userId)
      resolve(userNotifications)
    }, 500)
  })
}

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notificationIndex = mockNotifications.findIndex((n) => n.id === notificationId)
      if (notificationIndex !== -1) {
        mockNotifications[notificationIndex].read = true
        resolve(true)
      } else {
        resolve(false)
      }
    }, 300)
  })
}

// Create a new notification
export const createNotification = (notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      mockNotifications.push(newNotification)
      resolve(newNotification)
    }, 300)
  })
}

// Delete a notification
export const deleteNotification = (notificationId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = mockNotifications.length
      const updatedNotifications = mockNotifications.filter((n) => n.id !== notificationId)
      mockNotifications.length = 0
      mockNotifications.push(...updatedNotifications)
      resolve(initialLength !== mockNotifications.length)
    }, 300)
  })
}
