import React, { useState } from 'react';
import { FileSpreadsheet, Package, Users, Wrench } from 'lucide-react';
import { reportService } from '../services/reportService';
import styles from './AssetsPage.module.css';

const ReportsPage: React.FC = () => {
  const [downloadingAssets, setDownloadingAssets] = useState(false);
  const [downloadingEmployees, setDownloadingEmployees] = useState(false);
  const [downloadingMaintenance, setDownloadingMaintenance] = useState(false);

  const handleDownloadAssets = async () => {
    setDownloadingAssets(true);
    try {
      await reportService.downloadAssetsReport();
    } catch (err) {
      alert('Failed to download Assets report');
    } finally {
      setDownloadingAssets(false);
    }
  };

  const handleDownloadEmployees = async () => {
    setDownloadingEmployees(true);
    try {
      await reportService.downloadEmployeesReport();
    } catch (err) {
      alert('Failed to download Employees report');
    } finally {
      setDownloadingEmployees(false);
    }
  };

  const handleDownloadMaintenance = async () => {
    setDownloadingMaintenance(true);
    try {
      await reportService.downloadMaintenanceReport();
    } catch (err) {
      alert('Failed to download Maintenance report');
    } finally {
      setDownloadingMaintenance(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>System Reports</h1>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '1rem 0' }}>
        
        {/* Assets Report Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--status-in-use)' }}>
            <Package size={48} />
          </div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Assets Report</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Download a comprehensive Excel report of all assets in the system, including current status and location.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
            onClick={handleDownloadAssets}
            disabled={downloadingAssets}
          >
            <FileSpreadsheet size={20} />
            {downloadingAssets ? 'Generating...' : 'Download Excel'}
          </button>
        </div>

        {/* Employees Report Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: 'var(--status-available)' }}>
            <Users size={48} />
          </div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Employees Report</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Export a list of all registered employees and their respective departments and designations.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
            onClick={handleDownloadEmployees}
            disabled={downloadingEmployees}
          >
            <FileSpreadsheet size={20} />
            {downloadingEmployees ? 'Generating...' : 'Download Excel'}
          </button>
        </div>

        {/* Maintenance Report Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', color: 'var(--status-disposed)' }}>
            <Wrench size={48} />
          </div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0 }}>Maintenance Report</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Get a detailed overview of all maintenance tickets, repair costs, and asset downtime.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
            onClick={handleDownloadMaintenance}
            disabled={downloadingMaintenance}
          >
            <FileSpreadsheet size={20} />
            {downloadingMaintenance ? 'Generating...' : 'Download Excel'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportsPage;
