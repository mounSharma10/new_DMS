import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Search, Bell, Sun, Moon, Globe, ChevronDown,
  User, Settings, LogOut, Zap, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export function Header() {
  const { isDarkMode, toggleDarkMode, globalSearchQuery, setGlobalSearchQuery } = useApp();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Control Panel', path: '/control-panel' },
    { label: 'Advanced Search', path: '/advanced-search' },
  ];

  const notifications = [
    { id: 1, title: 'New document uploaded', desc: 'SecureTest folder · 2m ago', unread: true },
    { id: 2, title: 'Version 1.1.1 saved', desc: 'apicam-dummy.pdf · 15m ago', unread: true },
    { id: 3, title: 'Scheduler job completed', desc: 'Text extraction · 1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const updateSearch = (value: string) => {
    setGlobalSearchQuery(value);
    if (value.trim() && location.pathname !== '/') navigate('/');
  };

  return (
    <header className="h-14 flex items-center gap-3 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-slate-900 dark:text-white" style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.3px' }}>
          DocuVibes
        </span>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-md relative">
        <div className={`flex items-center gap-2 h-10 px-3 rounded-lg border transition-all duration-200 ${
          searchFocused
            ? 'border-blue-500 bg-white dark:bg-slate-800 shadow-md shadow-blue-100 dark:shadow-blue-900/20 ring-3 ring-blue-50 dark:ring-blue-900/30'
            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
        }`}>
          <input
            type="text"
            value={globalSearchQuery}
            onChange={e => updateSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 120)}
            placeholder="Search documents..."
            className="min-w-0 flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
          />
          {globalSearchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => updateSearch('')}
              className="shrink-0 size-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            aria-label="Search documents"
            onClick={() => updateSearch(globalSearchQuery)}
            className="shrink-0 size-7 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center gap-0.5 mx-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-150 relative ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        {/* Language */}
        <div className="relative">
          <button
            onClick={() => { setLangOpen(!langOpen); setNotifOpen(false); setProfileOpen(false); }}
            className="flex items-center gap-1 h-8 px-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
            style={{ fontWeight: 500 }}
          >
            <Globe className="w-4 h-4" />
            <span>EN</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {[['EN', 'English'], ['FR', 'Français'], ['DE', 'Deutsch'], ['NL', 'Nederlands']].map(([code, label]) => (
                  <button key={code} onClick={() => setLangOpen(false)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <span className="text-xs text-slate-400 w-6">{code}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); setLangOpen(false); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-900 dark:text-white" style={{ fontWeight: 600 }}>Notifications</span>
                  <span className="text-xs text-indigo-500 hover:text-indigo-600 cursor-pointer" style={{ fontWeight: 500 }}>Mark all read</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${n.unread ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-indigo-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300" style={{ fontWeight: n.unread ? 600 : 400 }}>{n.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative ml-1">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setLangOpen(false); }}
            className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white" style={{ fontSize: '10px', fontWeight: 700 }}>SA</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs text-slate-700 dark:text-slate-200" style={{ fontWeight: 600, lineHeight: 1.2 }}>Super Admin</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm text-slate-900 dark:text-white" style={{ fontWeight: 600 }}>Super Admin</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">SUPERADMIN</p>
                </div>
                {[
                  { icon: User, label: 'Profile Settings' },
                  { icon: Settings, label: 'Preferences' },
                ].map(({ icon: Icon, label }) => (
                  <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                  </button>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-700 mt-1">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
