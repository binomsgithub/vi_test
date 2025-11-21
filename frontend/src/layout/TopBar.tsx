import { useAuth } from '../context/AuthContext';

export function TopBar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Voice Intelligence</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            {new Date().toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="text-slate-500">Signed in as</span>
            <span className="font-medium text-slate-800">{user?.username}</span>
            <button
              onClick={logout}
              className="ml-2 px-2 py-1 rounded-full border border-slate-300 text-[11px] hover:bg-slate-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

