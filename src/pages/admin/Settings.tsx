import React, { useState } from 'react';
import { Breadcrumbs } from '../../components/shared/Breadcrumbs';
import { Shield, Save, User, Check, X, Database, Users, DollarSign } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    futebol_view: boolean;
    futebol_edit: boolean;
    users_view: boolean;
    users_edit: boolean;
    finance_view: boolean;
  };
}

const INITIAL_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full system access and configuration',
    permissions: {
      futebol_view: true,
      futebol_edit: true,
      users_view: true,
      users_edit: true,
      finance_view: true
    }
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Content management for sports & movies',
    permissions: {
      futebol_view: true,
      futebol_edit: true,
      users_view: false,
      users_edit: false,
      finance_view: false
    }
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access for auditing',
    permissions: {
      futebol_view: true,
      futebol_edit: false,
      users_view: true,
      users_edit: false,
      finance_view: false
    }
  }
];

export default function Settings() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (roleId: string, perm: keyof Role['permissions']) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        // Prevent removing critical permissions from Admin
        if (role.id === 'admin') return role;
        
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [perm]: !role.permissions[perm]
          }
        };
      }
      return role;
    }));
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to save the new roles configuration.
    // For this demo, we'll just show an alert and reset the change state.
    alert('Configurações salvas com sucesso!');
    setHasChanges(false);
  };

  return (
    <div className="p-8 bg-[#121212] min-h-screen text-white">
      <Breadcrumbs items={[{ label: 'Configurações' }]} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
      </div>

      {/* Roles & Permissions Section */}
      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 overflow-hidden shadow-xl mb-8">
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-white/5">
          <div className="p-3 bg-red-600/20 rounded-lg">
             <Shield className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Permissões e Funções (Roles)</h2>
            <p className="text-sm text-gray-400">Gerencie o acesso aos diferentes módulos da plataforma.</p>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-bold w-[250px]">Função</th>
                <th className="py-4 font-bold text-center">
                    <div className="flex flex-col items-center gap-1">
                        <Database className="w-4 h-4" />
                        <span>Futebol</span>
                        <span className="text-[10px] opacity-50 normal-case">(View / Edit)</span>
                    </div>
                </th>
                <th className="py-4 font-bold text-center">
                    <div className="flex flex-col items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Usuários</span>
                        <span className="text-[10px] opacity-50 normal-case">(View / Edit)</span>
                    </div>
                </th>
                <th className="py-4 font-bold text-center">
                    <div className="flex flex-col items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Financeiro</span>
                        <span className="text-[10px] opacity-50 normal-case">(View Only)</span>
                    </div>
                </th>
                <th className="py-4 font-bold text-right pr-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="py-6 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${role.id === 'admin' ? 'bg-red-900/20 text-red-500' : 'bg-gray-800 text-gray-400'}`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{role.name}</p>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Futebol Permissions */}
                  <td className="py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Toggle 
                            active={role.permissions.futebol_view} 
                            onChange={() => togglePermission(role.id, 'futebol_view')}
                            disabled={role.id === 'admin'}
                            tooltip="Visualizar Futebol"
                        />
                        <Toggle 
                            active={role.permissions.futebol_edit} 
                            onChange={() => togglePermission(role.id, 'futebol_edit')}
                            disabled={role.id === 'admin'}
                            tooltip="Editar Futebol"
                        />
                    </div>
                  </td>

                  {/* Users Permissions */}
                  <td className="py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Toggle 
                            active={role.permissions.users_view} 
                            onChange={() => togglePermission(role.id, 'users_view')}
                            disabled={role.id === 'admin'}
                            tooltip="Visualizar Usuários"
                        />
                        <Toggle 
                            active={role.permissions.users_edit} 
                            onChange={() => togglePermission(role.id, 'users_edit')}
                            disabled={role.id === 'admin'}
                            tooltip="Editar Usuários"
                        />
                    </div>
                  </td>

                  {/* Finance Permissions */}
                  <td className="py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Toggle 
                            active={role.permissions.finance_view} 
                            onChange={() => togglePermission(role.id, 'finance_view')}
                            disabled={role.id === 'admin'}
                            tooltip="Visualizar Financeiro"
                        />
                    </div>
                  </td>

                  <td className="py-6 pr-6 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/20">
                          Ativo
                      </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20 flex justify-end">
            <button 
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all
                    ${hasChanges 
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 hover:scale-105' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                `}
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
        </div>
      </div>
    </div>
  );
}

const Toggle = ({ active, onChange, disabled = false, tooltip }: { active: boolean; onChange: () => void; disabled?: boolean; tooltip?: string }) => (
  <button 
    onClick={!disabled ? onChange : undefined}
    disabled={disabled}
    title={tooltip}
    className={`
        relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-red-500 group
        ${active ? 'bg-green-600' : 'bg-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
    role="switch"
    aria-checked={active}
  >
    <span className="sr-only">{tooltip}</span>
    <span
      className={`
        absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out flex items-center justify-center
        ${active ? 'translate-x-5' : 'translate-x-0'}
      `}
    >
        {active ? <Check className="w-2.5 h-2.5 text-green-600" /> : <X className="w-2.5 h-2.5 text-gray-400" />}
    </span>
  </button>
);