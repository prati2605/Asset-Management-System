import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { getWarrantyAlerts } from '../services/assetService';
import type { DashboardStats, Asset } from '../types/api';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './DashboardPage.module.css';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [warrantyAlerts, setWarrantyAlerts] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          getDashboardStats(),
          getWarrantyAlerts(30)
        ]);
        
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        } else {
          setError(statsRes.message || 'Failed to fetch dashboard stats');
        }

        if (alertsRes.success && alertsRes.data) {
          setWarrantyAlerts(alertsRes.data);
        }
      } catch (err: any) {
        setError('Error fetching dashboard data. Please ensure you are logged in and the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--status-repair)' }}>{error}</div>;
  }

  if (!stats) return null;

  const departmentData = Object.entries(stats.assetsByDepartment).map(([name, value]) => ({ name, value }));
  const typeData = Object.entries(stats.assetsByType).map(([name, value]) => ({ name, value }));
  const COLORS = ['#003366', '#FF9933', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

  const criticalAlerts = warrantyAlerts.filter(a => {
    if (!a.warrantyExpiry) return false;
    const expiry = new Date(a.warrantyExpiry);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  const warningAlerts = warrantyAlerts.filter(a => {
    if (!a.warrantyExpiry) return false;
    const expiry = new Date(a.warrantyExpiry);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 7 && diffDays <= 30;
  });

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
      </header>

      {criticalAlerts.length > 0 && (
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} />
            <div>
              <strong>Critical Warranty Alerts!</strong> You have {criticalAlerts.length} asset(s) with warranties expiring in 7 days or less.
            </div>
          </div>
          <button 
            className="btn" 
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => navigate('/assets?warrantyFilter=7')}
          >
            View Assets <ChevronRight size={16} />
          </button>
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} />
            <div>
              <strong>Warranty Alerts!</strong> You have {warningAlerts.length} asset(s) with warranties expiring in 7-30 days.
            </div>
          </div>
          <button 
            className="btn" 
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={() => navigate('/assets?warrantyFilter=30')}
          >
            View Assets <ChevronRight size={16} />
          </button>
        </div>
      )}

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total Assets</span>
          <span className={styles.statValue}>{stats.totalAssets}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total Value (INR)</span>
          <span className={styles.statValue}>
            ₹{stats.totalAssetValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--status-available)' }}>
          <span className={styles.statTitle}>Available Assets</span>
          <span className={styles.statValue}>{stats.availableAssets}</span>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--status-in-use)' }}>
          <span className={styles.statTitle}>Assigned Assets</span>
          <span className={styles.statValue}>{stats.assignedAssets}</span>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--status-repair)' }}>
          <span className={styles.statTitle}>Maintenance</span>
          <span className={styles.statValue}>{stats.maintenanceAssets}</span>
        </div>
        <div className={styles.statCard} style={{ borderLeftColor: 'var(--text-secondary)' }}>
          <span className={styles.statTitle}>Total Employees</span>
          <span className={styles.statValue}>{stats.totalEmployees}</span>
        </div>
      </section>

      <section className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Assets by Department</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="var(--railway-blue)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Assets by Type</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
