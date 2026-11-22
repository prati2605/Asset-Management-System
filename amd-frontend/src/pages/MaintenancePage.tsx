import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, X, CheckCircle } from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';
import type { PaginatedMaintenance } from '../services/maintenanceService';
import { getAssets } from '../services/assetService';
import { vendorService } from '../services/vendorService';
import type { Maintenance, MaintenanceRequest, MaintenanceStatus, MaintenancePriority, Asset, Vendor } from '../types/api';
import { useAuth } from '../auth/AuthContext';
import styles from './AssetsPage.module.css';

const initialForm: MaintenanceRequest = {
  assetId: '',
  issueDescription: '',
  reportedDate: new Date().toISOString().split('T')[0],
  priority: 'MEDIUM',
  status: 'OPEN',
  technician: '',
  vendorId: '',
  repairCost: 0,
  completedDate: '',
  remarks: ''
};

const MaintenancePage: React.FC = () => {
  const [maintenancePage, setMaintenancePage] = useState<PaginatedMaintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MaintenanceRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown options
  const [assetsList, setAssetsList] = useState<Asset[]>([]);
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);

  const fetchMaintenance = async () => {
    setLoading(true);
    try {
      const data = await maintenanceService.getMaintenanceTickets(page, size, statusFilter, priorityFilter);
      setMaintenancePage(data);
    } catch (err) {
      setError('Failed to fetch maintenance tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, statusFilter, priorityFilter]);

  const loadDropdowns = async () => {
    try {
      const a = await getAssets(0, 1000);
      if (a.success && a.data) {
        setAssetsList(a.data.content);
      }
      const v = await vendorService.getVendors(0, 1000);
      if (v) {
        setVendorsList(v.content);
      }
    } catch (err) {
      console.error("Failed to load dropdowns", err);
    }
  };

  const openModal = async (maintenance?: Maintenance) => {
    await loadDropdowns();
    if (maintenance) {
      setEditingId(maintenance.id);
      setFormData({
        assetId: maintenance.assetId,
        issueDescription: maintenance.issueDescription,
        reportedDate: maintenance.reportedDate.split('T')[0],
        priority: maintenance.priority,
        status: maintenance.status,
        technician: maintenance.technician || '',
        vendorId: maintenance.vendorId || '',
        repairCost: maintenance.repairCost || 0,
        completedDate: maintenance.completedDate ? maintenance.completedDate.split('T')[0] : '',
        remarks: maintenance.remarks || ''
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await maintenanceService.updateMaintenance(editingId, formData);
      } else {
        await maintenanceService.createMaintenance(formData);
      }
      setIsModalOpen(false);
      fetchMaintenance();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save maintenance ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket? Only OPEN tickets can be deleted.')) {
      try {
        await maintenanceService.deleteMaintenance(id);
        fetchMaintenance();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete ticket');
      }
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return styles.badgeDisposed; // Red
      case 'HIGH': return styles.badgeRepair; // Orange
      case 'MEDIUM': return styles.badgeInUse; // Blue
      case 'LOW': return styles.badgeAvailable; // Green
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Maintenance & Repairs</h1>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Ticket
          </button>
        )}
      </header>

      <div className={styles.filters}>
        <select 
          className={styles.selectField} 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select 
          className={styles.selectField} 
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading tickets...</div>
        ) : error ? (
          <div style={{ padding: '2rem', color: 'var(--status-repair)' }}>{error}</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Issue Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported Date</th>
                  <th>Technician / Vendor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenancePage?.content.map(ticket => (
                  <tr key={ticket.id}>
                    <td style={{ fontWeight: 500 }}>{ticket.assetName}</td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.issueDescription}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(ticket.reportedDate).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{ticket.technician || '-'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ticket.vendorName}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {user?.role !== 'VIEWER' && (
                          <button className={styles.actionBtn} onClick={() => openModal(ticket)} title="Edit">
                            <Edit size={16} />
                          </button>
                        )}
                        {ticket.status === 'OPEN' && user?.role !== 'VIEWER' && (
                          <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleDelete(ticket.id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {maintenancePage?.content.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No maintenance tickets found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {maintenancePage && maintenancePage.totalPages > 0 && (
              <div className={styles.pagination}>
                <div>
                  Showing {page * size + 1} to {Math.min((page + 1) * size, maintenancePage.totalElements)} of {maintenancePage.totalElements} entries
                </div>
                <div className={styles.pageControls}>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)' }}
                    disabled={page === 0}
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                  >
                    Previous
                  </button>
                  <span style={{ padding: '0 1rem' }}>Page {page + 1} of {maintenancePage.totalPages}</span>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)' }}
                    disabled={page >= maintenancePage.totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Ticket' : 'Create Maintenance Ticket'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Select Asset *</label>
                  <select 
                    required 
                    className="input-field" 
                    value={formData.assetId} 
                    onChange={e => setFormData({...formData, assetId: e.target.value})}
                    disabled={!!editingId} // Cannot change asset once ticket is created
                  >
                    <option value="" disabled>-- Select Asset --</option>
                    {assetsList.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.qrCode}) - {asset.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Issue Description *</label>
                  <textarea 
                    required 
                    className="input-field" 
                    rows={3} 
                    value={formData.issueDescription} 
                    onChange={e => setFormData({...formData, issueDescription: e.target.value})} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reported Date *</label>
                  <input 
                    required 
                    type="date" 
                    className="input-field" 
                    value={formData.reportedDate} 
                    onChange={e => setFormData({...formData, reportedDate: e.target.value})} 
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Priority *</label>
                  <select 
                    required 
                    className="input-field" 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value as MaintenancePriority})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status *</label>
                  <select 
                    required 
                    className="input-field" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as MaintenanceStatus})}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Assigned Technician</label>
                  <input 
                    className="input-field" 
                    value={formData.technician} 
                    onChange={e => setFormData({...formData, technician: e.target.value})} 
                  />
                </div>

                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>External Vendor (Optional)</label>
                  <select 
                    className="input-field" 
                    value={formData.vendorId} 
                    onChange={e => setFormData({...formData, vendorId: e.target.value})}
                  >
                    <option value="">-- No Vendor --</option>
                    {vendorsList.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.companyName})
                      </option>
                    ))}
                  </select>
                </div>

                {formData.status === 'COMPLETED' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Repair Cost (INR) *</label>
                      <input 
                        required 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        className="input-field" 
                        value={formData.repairCost} 
                        onChange={e => setFormData({...formData, repairCost: parseFloat(e.target.value)})} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Completed Date *</label>
                      <input 
                        required 
                        type="date" 
                        className="input-field" 
                        value={formData.completedDate} 
                        onChange={e => setFormData({...formData, completedDate: e.target.value})} 
                      />
                    </div>
                    <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                      <label className={styles.formLabel}>Resolution Remarks</label>
                      <textarea 
                        className="input-field" 
                        rows={2} 
                        value={formData.remarks} 
                        onChange={e => setFormData({...formData, remarks: e.target.value})} 
                      />
                    </div>
                  </>
                )}
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
