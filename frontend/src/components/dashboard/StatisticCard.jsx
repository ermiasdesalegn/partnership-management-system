import PropTypes from "prop-types";

export function StatisticsCard({ color, icon, title, value, footer }) {
  // Define color mappings for the gradient background
  const colorClasses = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    orange: "from-orange-500 to-orange-700",
    purple: "from-purple-500 to-purple-700",
    red: "from-red-500 to-red-700",
  };

  return (
    <div className="border border-blue-gray-100 shadow-sm rounded-lg overflow-hidden relative">
      {/* Icon Container */}
      <div
        className={`absolute top-4 left-4 h-12 w-12 grid place-items-center bg-gradient-to-r ${colorClasses[color]} text-white rounded-lg shadow-md`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="p-4 text-right pt-16">
        <p className="text-sm font-normal text-blue-gray-600">{title}</p>
        <h4 className="text-2xl font-bold text-blue-gray-900">{value}</h4>
      </div>

      {/* Footer (if provided) */}
      {footer && (
        <div className="p-4 border-t border-blue-gray-100">{footer}</div>
      )}
    </div>
  );
}

// Prop Types for type checking
StatisticsCard.propTypes = {
  color: PropTypes.oneOf(["blue", "green", "orange", "purple", "red"])
    .isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  footer: PropTypes.node,
};

export default StatisticsCard;
