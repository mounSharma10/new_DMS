import {
  Building2, ShieldCheck, Users, FolderKanban, Plug,
  UserCog, Clock, FileSearch, SlidersHorizontal, Mail,
  GitBranch, Trash2, BookUser, ChevronRight, TrendingUp,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { controlPanelCards } from '../data/mockData';

const iconMap: Record<string, React.ElementType> = {
  Building2, ShieldCheck, Users, FolderKanban, Plug,
  UserCog, Clock, FileSearch, SlidersHorizontal, Mail,
  GitBranch, Trash2, BookUser,
};

const colorMap: Record<string, { bg: string; icon: string; border: string; shadow: string }> = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800/30', shadow: 'hover:shadow-indigo-100 dark:hover:shadow-indigo-900/30' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', icon: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-800/30', shadow: 'hover:shadow-violet-100 dark:hover:shadow-violet-900/30' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800/30', shadow: 'hover:shadow-blue-100 dark:hover:shadow-blue-900/30' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', icon: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-800/30', shadow: 'hover:shadow-cyan-100 dark:hover:shadow-cyan-900/30' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', icon: 'text-teal-600 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-800/30', shadow: 'hover:shadow-teal-100 dark:hover:shadow-teal-900/30' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800/30', shadow: 'hover:shadow-emerald-100 dark:hover:shadow-emerald-900/30' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800/30', shadow: 'hover:shadow-amber-100 dark:hover:shadow-amber-900/30' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800/30', shadow: 'hover:shadow-orange-100 dark:hover:shadow-orange-900/30' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', icon: 'text-pink-600 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-800/30', shadow: 'hover:shadow-pink-100 dark:hover:shadow-pink-900/30' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-900/20', icon: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-800/30', shadow: 'hover:shadow-rose-100 dark:hover:shadow-rose-900/30' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800/30', shadow: 'hover:shadow-purple-100 dark:hover:shadow-purple-900/30' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-600 dark:text-red-400', border: 'border-red-100 dark:border-red-800/30', shadow: 'hover:shadow-red-100 dark:hover:shadow-red-900/30' },
  slate: { bg: 'bg-slate-50 dark:bg-slate-800', icon: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700', shadow: 'hover:shadow-slate-100 dark:hover:shadow-slate-900/30' },
};

const stats = [
  { label: 'Total Documents', value: '3,317,938', change: '+12.4%', up: true, icon: FolderKanban },
  { label: 'Active Users', value: '248', change: '+3.2%', up: true, icon: Users },
  { label: 'Storage Used', value: '3.72 MB', change: '+0.8%', up: false, icon: Activity },
  { label: 'Classes', value: '43', change: '—', up: true, icon: Building2 },
];

export function ControlPanel() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F6F8FB] dark:bg-slate-950 p-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#e2e8f0 transparent' }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-slate-900 dark:text-white mb-1" style={{ fontWeight: 700, fontSize: '22px', letterSpacing: '-0.3px' }}>
          Control Panel
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and configure your DocuVibes enterprise settings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                {stat.change !== '—' && (
                  <span className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-md ${
                    stat.up ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  }`} style={{ fontWeight: 500 }}>
                    <TrendingUp className={`w-2.5 h-2.5 ${stat.up ? '' : 'rotate-180'}`} />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-slate-900 dark:text-white" style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Management cards */}
      <div className="mb-4">
        <h2 className="text-slate-700 dark:text-slate-300 mb-4" style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          Management
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {controlPanelCards.map((card, i) => {
            const Icon = iconMap[card.icon] || Building2;
            const colors = colorMap[card.color] || colorMap.indigo;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className={`group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 text-left transition-all duration-200 hover:shadow-lg ${colors.shadow} hover:border-slate-300 dark:hover:border-slate-600`}
              >
                <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-tight" style={{ fontWeight: 600 }}>
                  {card.title}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-tight">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`text-xs ${colors.icon}`} style={{ fontWeight: 500 }}>Open</span>
                  <ChevronRight className={`w-3 h-3 ${colors.icon}`} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
