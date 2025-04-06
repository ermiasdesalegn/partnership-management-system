import { useState } from "react";
import NotificationItem from './Item';

const initialNotifications = [
  {
    id: 1,
    message: "You have a new project request.",
    details: "A client has requested a new project.",
    read: true,
    link: "/user/request-status",
  },
  {
    id: 2,
    message: "Your draft agreement has been approved.",
    details: "Congratulations! Your request to the partnership is approved.",
    timestamp: "Yesterday",
    read: false,
    link: "/users/response/456",
  },
  {
    id: 1,
    message: "You have a new project request.",
    details: "A client has requested a new project.",
    timestamp: "2 hours ago",
    read: true,
    link: "/user/response/123",
  },
  {
    id: 2,
    message: "Your draft agreement has been approved.",
    details: "Congratulations! Your request to the partnership is approved.",
    timestamp: "Yesterday",
    read: false,
    link: "/users/response/456",
  },
  {
    id: 1,
    message: "You have a new project request.",
    details: "A client has requested a new project.",
    timestamp: "2 hours ago",
    read: true,
    link: "/user/response/123",
  },
  {
    id: 2,
    message: "Your draft agreement has been approved.",
    details: "Congratulations! Your request to the partnership is approved.",
    timestamp: "Yesterday",
    read: false,
    link: "/users/response/456",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (e, id) => {
    e.preventDefault();
    console.log(id);
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  return (
    <div className="mt-2 w-full bg-white rounded-lg shadow-lg ">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500 p-4">No new notifications</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))}
        </ul>
      )}
    </div>
  );
};



export default Notifications;
