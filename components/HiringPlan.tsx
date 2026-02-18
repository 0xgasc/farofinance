'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Users, Plus, Trash2, DollarSign, Building2, Calendar } from 'lucide-react';

interface Role {
  id: string;
  title: string;
  department: string;
  baseSalary: number;
  benefitsMultiplier: number;
  equipmentCost: number;
  startDate: string;
  headcount: number;
  status: 'planned' | 'approved' | 'hired' | 'cancelled';
}

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'Operations', 'Finance', 'HR'];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const defaultRoles: Role[] = [
  { id: '1', title: 'Senior Backend Engineer', department: 'Engineering', baseSalary: 180000, benefitsMultiplier: 1.25, equipmentCost: 3000, startDate: '2026-03-01', headcount: 2, status: 'approved' },
  { id: '2', title: 'Product Designer', department: 'Design', baseSalary: 140000, benefitsMultiplier: 1.25, equipmentCost: 4000, startDate: '2026-04-01', headcount: 1, status: 'planned' },
  { id: '3', title: 'Account Executive', department: 'Sales', baseSalary: 120000, benefitsMultiplier: 1.20, equipmentCost: 2000, startDate: '2026-03-15', headcount: 2, status: 'approved' },
  { id: '4', title: 'Frontend Engineer', department: 'Engineering', baseSalary: 165000, benefitsMultiplier: 1.25, equipmentCost: 3000, startDate: '2026-05-01', headcount: 1, status: 'planned' },
  { id: '5', title: 'Marketing Manager', department: 'Marketing', baseSalary: 130000, benefitsMultiplier: 1.20, equipmentCost: 2000, startDate: '2026-06-01', headcount: 1, status: 'planned' },
  { id: '6', title: 'DevOps Engineer', department: 'Engineering', baseSalary: 175000, benefitsMultiplier: 1.25, equipmentCost: 3000, startDate: '2026-04-15', headcount: 1, status: 'planned' },
];

export default function HiringPlan() {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [showAdd, setShowAdd] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    department: 'Engineering',
    benefitsMultiplier: 1.25,
    equipmentCost: 2000,
    headcount: 1,
    status: 'planned',
  });

  const activeRoles = roles.filter((r) => r.status !== 'cancelled');

  const totalHeadcount = activeRoles.reduce((s, r) => s + r.headcount, 0);
  const totalAnnualCost = activeRoles.reduce((s, r) => {
    const fullyLoaded = r.baseSalary * r.benefitsMultiplier + r.equipmentCost;
    return s + fullyLoaded * r.headcount;
  }, 0);
  const totalMonthlyBurn = totalAnnualCost / 12;

  const departmentData = useMemo(() => {
    const depts: Record<string, { headcount: number; cost: number }> = {};
    activeRoles.forEach((r) => {
      if (!depts[r.department]) depts[r.department] = { headcount: 0, cost: 0 };
      depts[r.department].headcount += r.headcount;
      depts[r.department].cost += (r.baseSalary * r.benefitsMultiplier + r.equipmentCost) * r.headcount;
    });
    return Object.entries(depts).map(([name, data]) => ({ name, ...data }));
  }, [activeRoles]);

  const timelineData = useMemo(() => {
    const months: Record<string, { month: string; newHires: number; cumulativeHeadcount: number; monthlyCost: number }> = {};
    const sorted = [...activeRoles].sort((a, b) => a.startDate.localeCompare(b.startDate));
    let cumulative = 0;
    let cumCost = 0;

    sorted.forEach((r) => {
      const monthKey = r.startDate.slice(0, 7);
      const d = new Date(r.startDate);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!months[monthKey]) {
        months[monthKey] = { month: label, newHires: 0, cumulativeHeadcount: cumulative, monthlyCost: cumCost };
      }
      cumulative += r.headcount;
      cumCost += (r.baseSalary * r.benefitsMultiplier + r.equipmentCost) * r.headcount / 12;
      months[monthKey].newHires += r.headcount;
      months[monthKey].cumulativeHeadcount = cumulative;
      months[monthKey].monthlyCost = cumCost;
    });

    return Object.values(months);
  }, [activeRoles]);

  const addRole = () => {
    if (!newRole.title || !newRole.baseSalary || !newRole.startDate) return;
    setRoles([...roles, { ...newRole, id: Date.now().toString() } as Role]);
    setNewRole({ department: 'Engineering', benefitsMultiplier: 1.25, equipmentCost: 2000, headcount: 1, status: 'planned' });
    setShowAdd(false);
  };

  const removeRole = (id: string) => {
    setRoles(roles.map((r) => r.id === id ? { ...r, status: 'cancelled' as const } : r));
  };

  const fmt = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const statusColors: Record<string, string> = {
    planned: 'bg-gray-100 text-gray-700',
    approved: 'bg-blue-100 text-blue-700',
    hired: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">New Headcount</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalHeadcount}</p>
          <p className="text-xs text-gray-500 mt-1">{departmentData.length} departments</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-600">Annual Cost (Fully Loaded)</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{fmt(totalAnnualCost)}</p>
          <p className="text-xs text-gray-500 mt-1">Includes benefits & equipment</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Monthly Burn Impact</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{fmt(totalMonthlyBurn)}</p>
          <p className="text-xs text-gray-500 mt-1">Added monthly cost</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Cost by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="cost"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {departmentData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hiring Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Hiring Timeline</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="newHires" name="New Hires" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cumulativeHeadcount" name="Total Headcount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Planned Roles</h3>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:opacity-90"
          >
            <Plus size={16} />
            Add Role
          </button>
        </div>

        {showAdd && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Job Title"
                value={newRole.title || ''}
                onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <select
                value={newRole.department}
                onChange={(e) => setNewRole({ ...newRole, department: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <input
                type="number"
                placeholder="Base Salary"
                value={newRole.baseSalary || ''}
                onChange={(e) => setNewRole({ ...newRole, baseSalary: parseFloat(e.target.value) })}
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="date"
                value={newRole.startDate || ''}
                onChange={(e) => setNewRole({ ...newRole, startDate: e.target.value })}
                className="px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3 mt-3">
              <input
                type="number"
                placeholder="Headcount"
                value={newRole.headcount || ''}
                onChange={(e) => setNewRole({ ...newRole, headcount: parseInt(e.target.value) })}
                className="w-24 px-3 py-2 border rounded-lg text-sm"
              />
              <button onClick={addRole} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                Add
              </button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Department</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Base Salary</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Fully Loaded</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">HC</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Start</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Total Cost</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {roles.filter((r) => r.status !== 'cancelled').map((role) => {
                const fullyLoaded = role.baseSalary * role.benefitsMultiplier + role.equipmentCost;
                const totalCost = fullyLoaded * role.headcount;
                return (
                  <tr key={role.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{role.title}</td>
                    <td className="px-4 py-3 text-gray-600">{role.department}</td>
                    <td className="text-right px-4 py-3">{fmt(role.baseSalary)}</td>
                    <td className="text-right px-4 py-3">{fmt(fullyLoaded)}</td>
                    <td className="text-center px-4 py-3">{role.headcount}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(role.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</td>
                    <td className="text-center px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[role.status]}`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3 font-semibold">{fmt(totalCost)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeRole(role.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
