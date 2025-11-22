
import React from 'react';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';
import { Users, Tv, Trophy, DollarSign, TrendingUp, Activity, AlertCircle, ExternalLink, Server, Database, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Visão Geral</h1>
            <p className="text-gray-400 mt-1">Bem-vindo ao painel de controle da RedFlix.</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 bg-[#1E1E1E] px-4 py-2 rounded-full border border-white/5 shadow-lg">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                <span className="font-mono">SYSTEM: ONLINE</span>
            </div>
            <span className="text-gray-700">|</span>
            <span className="font-mono text-xs">v2.4.0</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users className="w-6 h-6 text-blue-400" />}
          title="Assinantes Totais"
          value="1.245"
          change="+12% este mês"
          trend="up"
          delay={0}
          color="blue"
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6 text-yellow-400" />}
          title="Jogos Ativos"
          value="3"
          change="Série A • Ao Vivo"
          trend="neutral"
          delay={0.1}
          color="yellow"
        />
        <StatCard 
          icon={<Tv className="w-6 h-6 text-red-400" />}
          title="Canais Online"
          value="42/45"
          change="3 em manutenção"
          trend="down"
          delay={0.2}
          color="red"
        />
        <StatCard 
          icon={<DollarSign className="w-6 h-6 text-green-400" />}
          title="Receita Mensal"
          value="R$ 24.9k"
          change="+8.5% vs mês anterior"
          trend="up"
          delay={0.3}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart / Activity Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-500" />
                    Ações Rápidas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <ActionButton 
                        href="/admin/futebol/serie-a" 
                        title="Gerenciar Série A" 
                        desc="Atualizar tabela e times"
                        icon="⚽"
                    />
                    <ActionButton 
                        href="/admin/vod" 
                        title="Curadoria VOD" 
                        desc="Destaques da Home"
                        icon="🎬"
                    />
                    <ActionButton 
                        href="/admin/users" 
                        title="Usuários" 
                        desc="Gerenciar acessos"
                        icon="👥"
                    />
                    <ActionButton 
                        href="/admin/futebol/json-generator" 
                        title="Exportar JSON" 
                        desc="Atualizar apps mobile"
                        icon="{}"
                    />
                </div>
            </div>

            {/* Server Load Visualization (CSS Chart) */}
            <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-6 shadow-xl relative overflow-hidden">
                 <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Tráfego de Streaming (24h)
                    </h2>
                    <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/10">Atualizado agora</span>
                 </div>
                 
                 {/* Background Grid */}
                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                 <div className="h-48 flex items-end gap-1 md:gap-2 relative z-10">
                    {[...Array(30)].map((_, i) => {
                        const height = Math.floor(Math.random() * 60) + 20;
                        const isPeak = height > 70;
                        return (
                            <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-500 ${isPeak ? 'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500/40 hover:bg-blue-400'}`} 
                                    style={{ height: `${height}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                                    {height}% Load
                                </div>
                            </div>
                        )
                    })}
                 </div>
                 <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono border-t border-white/5 pt-2">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>23:59</span>
                 </div>
            </div>
          </motion.div>

          {/* Sidebar Stats & Status */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="space-y-6"
          >
             {/* System Health */}
             <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-6 shadow-xl">
                 <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-500" />
                    Status da Infraestrutura
                 </h2>
                 <div className="space-y-4">
                     <StatusItem label="API Gateway" status="online" ping="24ms" icon={<Wifi className="w-3 h-3" />} />
                     <StatusItem label="Database Primary" status="online" ping="12ms" icon={<Database className="w-3 h-3" />} />
                     <StatusItem label="CDN (Images)" status="online" ping="45ms" icon={<Server className="w-3 h-3" />} />
                     <StatusItem label="Transcoder Queue" status="warning" message="Load High" icon={<Activity className="w-3 h-3" />} />
                 </div>
             </div>

             {/* Recent Activity Feed */}
             <div className="bg-[#1E1E1E] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="font-bold text-sm">Atividade Recente</h3>
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Ver log completo</button>
                </div>
                <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                    <ActivityItem user="Admin" action="Atualizou Tabela Série A" time="2 min atrás" type="edit" />
                    <ActivityItem user="Editor" action="Adicionou 'The Witcher'" time="15 min atrás" type="add" />
                    <ActivityItem user="System" action="Backup Automático" time="1h atrás" type="system" />
                    <ActivityItem user="Admin" action="Exportou JSON Mobile" time="3h atrás" type="export" />
                    <ActivityItem user="Viewer" action="Login falho detectado" time="5h atrás" type="alert" />
                </div>
             </div>
          </motion.div>
      </div>
    </div>
  );
}

// --- Helper Components ---

const StatCard = ({ icon, title, value, change, trend, delay, color }: any) => {
    const colors: any = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
        green: 'bg-green-500/10 text-green-400 border-green-500/20',
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-[#1E1E1E] border border-white/5 rounded-xl p-5 hover:border-white/15 transition-all group hover:-translate-y-1 shadow-lg"
      >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-lg transition-colors ${colors[color]}`}>
                {icon}
            </div>
            {trend === 'up' && <div className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">↗ 2.4%</div>}
            {trend === 'down' && <div className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20 flex items-center gap-1">↘ 1.2%</div>}
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            {trend === 'down' ? <AlertCircle className="w-3 h-3" /> : null}
            {change}
        </p>
      </motion.div>
    );
}

const ActionButton = ({ href, title, desc, icon }: any) => (
    <a href={href} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-white/5 hover:bg-white/5 hover:border-red-500/30 transition-all group cursor-pointer">
        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-sm text-white group-hover:text-red-500 transition-colors">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-600 ml-auto group-hover:text-gray-400" />
    </a>
);

const StatusItem = ({ label, status, ping, message, icon }: any) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded flex items-center justify-center ${status === 'online' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                {icon}
            </div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
        <div className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-1 rounded border border-white/5">
            {message ? <span className="text-yellow-500">{message}</span> : ping}
        </div>
    </div>
);

const ActivityItem = ({ user, action, time, type }: any) => {
    const getIcon = () => {
        switch(type) {
            case 'edit': return <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />;
            case 'add': return <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />;
            case 'alert': return <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />;
            default: return <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />;
        }
    }

    return (
        <div className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:border-white/30 transition-colors">
                    {user.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{action}</p>
                        {getIcon()}
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{user}</p>
                </div>
            </div>
            <span className="text-xs text-gray-600 font-mono">{time}</span>
        </div>
    );
}
