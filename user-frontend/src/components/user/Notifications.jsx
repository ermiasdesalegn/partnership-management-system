/* eslint-disable react/prop-types */
import { useState } from "react";
import { BiMessageRoundedCheck } from "react-icons/bi";
import { Link } from "react-router";

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
    <div className="absolute right-13 top-15 mt-2 w-72  bg-white rounded-lg shadow-lg overflow-hidden">
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

const NotificationItem = ({ notification, onMarkRead }) => {
  return (
    <li
      className={`px-4 py-2 hover:bg-gray-300 flex justify-between items-start ${
        notification.read ? "bg-gray-100" : "bg-blue-50"
      }`}
    >
      <Link
        to={notification.link}
        className="text-sm font-medium text-gray-900 block text-start"
      >
        <div>
          {notification.message}
          <p className="text-xs text-gray-500">{notification.timestamp}</p>
        </div>
      </Link>
      {notification.read && (
        <button
          className="text-blue-500 hover:text-blue-700 "
          onClick={(e) => onMarkRead(e, notification.id)}
        >
          <BiMessageRoundedCheck size={21} />
        </button>
      )}
    </li>
  );
};

export default Notifications;
