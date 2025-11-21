import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/overview', label: 'Performance Overview' },
  { path: '/journey-policy', label: 'Order Flow & Policy' },
  { path: '/sales-upsell', label: 'Sales & Upsell Performance' },
  { path: '/friendliness', label: 'Friendliness & Sentiment' },
  { path: '/alerts-coaching', label: 'Alerts & Coaching Queue' },
  { path: '/explore-compare', label: 'Explore & Cohort Compare' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Voice Intelligence</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

