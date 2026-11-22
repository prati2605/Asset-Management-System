import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import { vendorService } from '../services/vendorService';
import type { PaginatedVendors } from '../services/vendorService';
import type { Vendor, VendorRequest } from '../types/api';
import { useAuth } from '../auth/AuthContext';
import styles from './AssetsPage.module.css'; // Reuse existing styles for consistency

const initialForm: VendorRequest = {
  vendorCode: '',
  name: '',
  companyName: '',
  email: '',
  phone: '',
  address: ''
};

const VendorsPage: React.FC = () => {
  const [vendorsPage, setVendorsPage] = useState<PaginatedVendors | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [keyword, setKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<VendorRequest>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorService.getVendors(page, size, keyword);
      setVendorsPage(data);
    } catch (err) {
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchVendors();
  };

  const openModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingId(vendor.id);
      setFormData({
        vendorCode: vendor.vendorCode,
        name: vendor.name,
        companyName: vendor.companyName,
        email: vendor.email,
        phone: vendor.phone || '',
        address: vendor.address || ''
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
        await vendorService.updateVendor(editingId, formData);
      } else {
        await vendorService.createVendor(formData);
      }
      setIsModalOpen(false);
      fetchVendors();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorService.deleteVendor(id);
        fetchVendors();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete vendor');
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vendor Management</h1>
        {user?.role !== 'VIEWER' && (
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Vendor
          </button>
        )}
      </header>

      <div className={styles.filters}>
        <form onSubmit={handleSearch} className={styles.searchBar} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search vendors..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading vendors...</div>
        ) : error ? (
          <div style={{ padding: '2rem', color: 'var(--status-repair)' }}>{error}</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Vendor Code</th>
                  <th>Name / Company</th>
                  <th>Contact Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorsPage?.content.map(vendor => (
                  <tr key={vendor.id}>
                    <td style={{ fontWeight: 500 }}>{vendor.vendorCode}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{vendor.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {vendor.companyName}
                      </div>
                    </td>
                    <td>
                      <div>{vendor.email}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {vendor.phone || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {user?.role !== 'VIEWER' && (
                          <button className={styles.actionBtn} onClick={() => openModal(vendor)} title="Edit">
                            <Edit size={16} />
                          </button>
                        )}
                        {user?.role !== 'VIEWER' && (
                          <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={() => handleDelete(vendor.id)} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {vendorsPage?.content.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No vendors found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {vendorsPage && vendorsPage.totalPages > 0 && (
              <div className={styles.pagination}>
                <div>
                  Showing {page * size + 1} to {Math.min((page + 1) * size, vendorsPage.totalElements)} of {vendorsPage.totalElements} entries
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
                  <span style={{ padding: '0 1rem' }}>Page {page + 1} of {vendorsPage.totalPages}</span>
                  <button
                    className="btn"
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)' }}
                    disabled={page >= vendorsPage.totalPages - 1}
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
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Vendor Code *</label>
                  <input required className="input-field" value={formData.vendorCode} onChange={e => setFormData({...formData, vendorCode: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Contact Name *</label>
                  <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Company Name *</label>
                  <input required className="input-field" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email *</label>
                  <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone</label>
                  <input className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label className={styles.formLabel}>Address</label>
                  <textarea className="input-field" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
