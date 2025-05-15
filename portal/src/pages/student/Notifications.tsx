"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getUserNotifications, markNotificationAsRead, deleteNotification } from "../../services/notificationService"
import type { Notification } from "../../models/types"
import Layout from "../../components/Layout"
import Sidebar from "../../components/Sidebar"

const NotificationsPage: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.id) {
        setLoading(true)
        try {
          const userNotifications = await getUserNotifications(user.id)
          setNotifications(userNotifications)
        } catch (error) {
          console.error("Failed to fetch notifications:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchNotifications()
  }, [user?.id])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      )
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const success = await deleteNotification(notificationId)
      if (success) {
        setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== notificationId))
      }
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read)

    for (const notification of unreadNotifications) {
      try {
        await markNotificationAsRead(notification.id)
      } catch (error) {
        console.error(`Failed to mark notification ${notification.id} as read:`, error)
      }
    }

    setNotifications((prevNotifications) => prevNotifications.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  return (
    <Layout>
      <div className="flex">
      <Sidebar role="student" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled={!notifications.some((n) => !n.read)}
              >
                Mark all as read
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                className={`py-2 px-4 ${filter === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`py-2 px-4 ${filter === "unread" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
              <button
                className={`py-2 px-4 ${filter === "application" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setFilter("application")}
              >
                Applications
              </button>
              <button
                className={`py-2 px-4 ${filter === "document" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                onClick={() => setFilter("document")}
              >
                Documents
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-600">No notifications found</p>
              <p className="mt-2 text-gray-500">
                {filter !== "all"
                  ? "Try changing your filter to see more notifications."
                  : "You have no notifications at this time."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                      <p className="mt-1 text-gray-600">{notification.message}</p>
                      <p className="mt-2 text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Mark as read"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete notification"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notification.type === "application"
                          ? "bg-purple-100 text-purple-800"
                          : notification.type === "document"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </Layout>
  )
}

export default NotificationsPage
