/* eslint-disable react/prop-types */
import { BiMessageRoundedCheck } from "react-icons/bi";
import { Link } from "react-router";

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

export default NotificationItem;
