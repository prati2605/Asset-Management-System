import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit,
  Trash2, 
  X,
  Download,
  QrCode
} from 'lucide-react';
import { 
  getAssets, 
  createAsset, 
  updateAsset, 
  deleteAsset,
  getWarrantyAlerts
} from '../services/assetService';
import { assignAsset, returnAsset } from '../services/assignmentService';
import { getEmployees } from '../services/employeeService';
import { vendorService } from '../services/vendorService';
import { useAuth } from '../auth/AuthContext';
import { reportService } from '../services/reportService';
import type { AssetRequest, AssetStatus, Page } from '../types/asset';
import type { Asset } from '../types/api';
import type { Employee } from '../types/api';
import styles from './AssetsPage.module.css';

const initialAssetForm: AssetRequest = {
  name: '',
  assetType: '',
  brand: '',
  model: '',
  serialNumber: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  purchaseCost: 0,
  status: 'AVAILABLE',
  department: '',
  location: '',
  vendorId: '',
};

const AssetsPage: React.FC = () => {
  const [assetsPage, setAssetsPage] = useState<Page<Asset> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const initialWarrantyFilter = searchParams.get('warrantyFilter');
  const [warrantyFilterDays, setWarrantyFilterDays] = useState<number | null>(
    initialWarrantyFilter && initialWarrantyFilter !== 'true' ? parseInt(initialWarrantyFilter) : (initialWarrantyFilter === 'true' ? 30 : null)
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssetRequest>(initialAssetForm);
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  // Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningAssetId, setAssigningAssetId] = useState<string | null>(null);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | ''>('');
  const [assignError, setAssignError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrModalAsset, setQrModalAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      if (warrantyFilterDays) {
        const response = await getWarrantyAlerts(warrantyFilterDays);
        if (response.success && response.data) {
          setAssetsPage({
            content: response.data,
            totalElements: response.data.length,
            totalPages: 1,
            size: response.data.length,
            number: 0,
            first: true,
            last: true,
            empty: response.data.length === 0
          });
        }
      } else {
        const response = await getAssets(page, size, keyword, statusFilter, typeFilter);
        if (response.success && response.data) {
          setAssetsPage(response.data);
        }
      }
    } catch (err: any) {
      setError('Failed to fetch assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, statusFilter, typeFilter, warrantyFilterDays]); // re-fetch on these changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchAssets();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAsset(id);
        fetchAssets();
      } catch (err) {
        alert('Failed to delete asset');
      }
    }
  };

  const openModal = (asset?: Asset) => {
    if (asset) {
      setEditingId(asset.id);
      setFormData({
        name: asset.name,
        assetType: asset.assetType,
        brand: asset.brand || '',
        model: asset.model || '',
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate.split('T')[0],
        purchaseCost: asset.purchaseCost,
        status: asset.status,
        department: asset.department || '',
        location: asset.location || '',
        vendorId: asset.vendorId || '',
      });
    } else {
      setEditingId(null);
      setFormData(initialAssetForm);
    }
    
    // Fetch vendors for dropdown
    vendorService.getVendors(0, 1000, '').then(res => {
      if (res && res.content) {
        setVendorsList(res.content);
      }
    }).catch(console.error);

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAsset(editingId, formData);
      } else {
        await createAsset(formData);
      }
      setIsModalOpen(false);
      fetchAssets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnAsset = async (id: string) => {
    if (window.confirm('Are you sure you want to mark this asset as returned?')) {
      try {
        await returnAsset(id);
        fetchAssets();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to return asset');
      }
    }
  };

  const openAssignModal = async (assetId: string) => {
    setAssigningAssetId(assetId);
    setSelectedEmployeeId('');
    setAssignError('');
    setIsAssignModalOpen(true);
    try {
      // Fetch employees for the dropdown. For a real app with many employees, this might need an async search select.
      const res = await getEmployees(0, 1000, ''); 
      if (res.success && res.data) {
        setEmployeesList(res.data.content);
      }
    } catch (err) {
      setAssignError('Failed to load employees.');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningAssetId || !selectedEmployeeId) return;
    setIsSubmitting(true);
    setAssignError('');
    try {
      await assignAsset(assigningAssetId, selectedEmployeeId);
      setIsAssignModalOpen(false);
      fetchAssets();
    } catch (err: any) {
      setAssignError(err.response?.data?.message || 'Failed to assign asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: AssetStatus) => {
    switch (status) {
      case 'AVAILABLE': return styles.badgeAvailable;
      case 'IN_USE': return styles.badgeInUse;
      case 'UNDER_REPAIR': return styles.badgeRepair;
      case 'DISPOSED': return styles.badgeDisposed;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Asset Management</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={() => reportService.downloadAssetsReport()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)' }}>
            <Download size={18} /> Export
          </button>
          {user?.role !== 'VIEWER' && (
            <button className="btn btn-primary" onClick={() => openModal()}>
              <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Asset
            </button>
          )}
        </div>
      </header>

      <div className={styles.filters}>
        <form onSubmit={handleSearch} className={styles.searchBar} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by name, serial..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
            <Search size={18} />
          </button>
        </form>

        <select 
          className={styles.selectField} 
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="IN_USE">In Use</option>
          <option value="UNDER_REPAIR">Under Repair</option>
          <option value="DISPOSED">Disposed</option>
        </select>

        <select 
          className={styles.selectField} 
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Types</option>
          <option value="IT Equipment">IT Equipment</option>
          <option value="Railway Operations Equipment">Railway Operations</option>
          <option value="Furniture">Furniture</option>
          <option value="Vehicles">Vehicles</option>
        </select>

        <select 
          className={styles.selectField} 
          value={warrantyFilterDays || ''}
          onChange={(e) => { 
            const val = e.target.value;
            if (val) {
              setWarrantyFilterDays(parseInt(val));
              setSearchParams({ warrantyFilter: val });
            } else {
              setWarrantyFilterDays(null);
              setSearchParams({});
            }
            setPage(0); 
          }}
        >
          <option value="">All Warranties</option>
          <option value="7">Expiring in 7 Days</option>
          <option value="30">Expiring in 30 Days</option>
          <option value="60">Expiring in 60 Days</option>
          <option value="90">Expiring in 90 Days</option>
          <option value="120">Expiring in 120 Days</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading assets...</div>
        ) : error ? (
          <div style={{ padding: '2rem', color: 'red' }}>{error}</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name / Model</th>
                  <th>Type</th>
                  <th>Serial No.</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assetsPage?.content.map(asset => (
                  <tr key={asset.id}>
                    <td>{asset.qrCode}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{asset.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {asset.brand} {asset.model}
                      </div>
                    </td>
                    <td>{asset.assetType}</td>
                    <td>{asset.serialNumber}</td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadgeClass(asset.status)}`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{asset.department || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {user?.role !== 'VIEWER' && (
                          <button className={styles.actionBtn} onClick={() => openModal(asset)} title="Edit">
                            <Edit size={16} />
                          </button>
                        )}
                        <button className={styles.actionBtn} onClick={() => setQrModalAsset(asset)} title="View QR Code">
                          <QrCode size={16} />
                        </button>
                        {user?.role !== 'VIEWER' && (
                          <button 
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`} 
                            onClick={() => handleDelete(asset.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        {asset.status === 'AVAILABLE' && user?.role !== 'VIEWER' && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => openAssignModal(asset.id)}
                          >
                            Assign
                          </button>
                        )}
                        {asset.status === 'IN_USE' && user?.role !== 'VIEWER' && (
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'var(--status-in-use)', color: 'white' }}
                            onClick={() => handleReturnAsset(asset.id)}
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {assetsPage?.content.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No assets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {assetsPage && assetsPage.totalPages > 0 && (
              <div className={styles.pagination}>
                <div>
                  Showing {page * size + 1} to {Math.min((page + 1) * size, assetsPage.totalElements)} of {assetsPage.totalElements} entries
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
                  <span style={{ padding: '0 1rem' }}>Page {page + 1} of {assetsPage.totalPages}</span>
                  <button 
                    className="btn" 
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)' }}
                    disabled={assetsPage.last}
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
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Asset' : 'Add New Asset'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Asset Name *</label>
                  <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Asset Type *</label>
                  <input required className="input-field" value={formData.assetType} onChange={e => setFormData({...formData, assetType: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Brand *</label>
                  <input required className="input-field" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Model *</label>
                  <input required className="input-field" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Serial Number *</label>
                  <input required className="input-field" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Purchase Date *</label>
                  <input required type="date" className="input-field" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Purchase Cost (INR) *</label>
                  <input required type="number" min="0" step="0.01" className="input-field" value={formData.purchaseCost} onChange={e => setFormData({...formData, purchaseCost: parseFloat(e.target.value)})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status *</label>
                  <select required className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as AssetStatus})}>
                    <option value="AVAILABLE">Available</option>
                    <option value="IN_USE">In Use</option>
                    <option value="UNDER_REPAIR">Under Repair</option>
                    <option value="DISPOSED">Disposed</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department</label>
                  <input className="input-field" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Location</label>
                  <input className="input-field" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Vendor</label>
                  <select className="input-field" value={formData.vendorId || ''} onChange={e => setFormData({...formData, vendorId: e.target.value})}>
                    <option value="">-- No Vendor --</option>
                    {vendorsList.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.company})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Assign Asset</h2>
              <button className={styles.closeBtn} onClick={() => setIsAssignModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            {assignError && <div style={{ color: 'var(--status-repair)', marginBottom: '1rem' }}>{assignError}</div>}
            <form onSubmit={handleAssignSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Employee *</label>
                <select 
                  required 
                  className="input-field" 
                  value={selectedEmployeeId} 
                  onChange={e => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="" disabled>-- Select Employee --</option>
                  {employeesList.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeCode}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting || !selectedEmployeeId}>
                  {isSubmitting ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {qrModalAsset && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '400px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Asset QR Code</h2>
              <button className={styles.closeBtn} onClick={() => setQrModalAsset(null)}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <QRCodeSVG 
                value={`Asset ID: ${qrModalAsset.qrCode}\nName: ${qrModalAsset.name}\nType: ${qrModalAsset.assetType}\nBrand: ${qrModalAsset.brand || 'N/A'}\nModel: ${qrModalAsset.model || 'N/A'}\nSerial Number: ${qrModalAsset.serialNumber || 'N/A'}\nDepartment: ${qrModalAsset.department || 'N/A'}\nLocation: ${qrModalAsset.location || 'N/A'}\nStatus: ${qrModalAsset.status}\nPurchase Date: ${qrModalAsset.purchaseDate?.split('T')[0] || 'N/A'}\nCost: ${qrModalAsset.purchaseCost || 'N/A'}\nWarranty: ${qrModalAsset.warrantyExpiry ? qrModalAsset.warrantyExpiry.split('T')[0] : 'N/A'}`} 
                size={220} 
              />
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '1.5rem', width: '100%' }}
                onClick={() => setQrModalAsset(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsPage;
