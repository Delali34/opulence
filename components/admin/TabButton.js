export const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 p-4 w-full ${
      active ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-indigo-50"
    } transition duration-200`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);
