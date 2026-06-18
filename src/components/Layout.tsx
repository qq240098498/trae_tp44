import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Users,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  Home,
  Menu,
  X,
  Scale,
  AlertTriangle,
} from 'lucide-react';

const navigation = [
  { name: '首页', path: '/', icon: Home },
  { name: '职位描述', path: '/job-description', icon: FileText },
  { name: '简历筛选', path: '/resume-screening', icon: Users },
  { name: '面试问题', path: '/interview-questions', icon: ClipboardList },
  { name: '面试评价', path: '/interview-evaluation', icon: MessageSquare },
  { name: '录用决策', path: '/hiring-decision', icon: CheckCircle2 },
  { name: '离职风险评估', path: '/attrition-risk', icon: AlertTriangle },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-900 to-accent-blue rounded-xl flex items-center justify-center shadow-glow">
                <Scale size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-primary-900">
                  智能招聘辅助系统
                </h1>
                <p className="text-xs text-slate-500">公平 · 客观 · 高效</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              公平性保障已启用
            </span>
          </div>
        </div>
      </header>

      <aside
        className={`fixed top-[73px] left-0 bottom-0 z-40 w-64 bg-white/95 backdrop-blur-md border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`nav-link flex items-center gap-3 ${
                  isActive ? 'active' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animation: 'fadeIn 0.3s ease-out both',
                }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="card p-4 bg-gradient-to-br from-primary-900/5 to-accent-blue/5">
            <p className="text-sm text-primary-700 font-medium mb-1">
              公平招聘提示
            </p>
            <p className="text-xs text-slate-600">
              系统已自动屏蔽性别、年龄、地域等敏感信息，请基于能力进行评估。
            </p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 pt-[73px] min-h-screen">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}
