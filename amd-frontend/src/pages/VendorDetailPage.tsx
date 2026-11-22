import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { vendorService } from '../services/vendorService';
import type { PaginatedVendors } from '../services/vendorService';
import type { Vendor, Asset } from '../types/api';
import type { Page } from '../types/asset';
import styles from './AssetsPage.module.css'; // Reusing styles

const VendorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [assetsPage, setAssetsPage] = useState<Page<Asset> | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    if (id) {
      fetchVendorDetails(id);
    }
  }, [id, page, size]);

  const fetchVendorDetails = async (vendorId: string) => {
    setLoading(true);
    try {
      const v = await vendorService.getVendorById(vendorId);
      setVendor(v);
      const a = await vendorService.getVendorAssets(vendorId, page, size);
      setAssetsPage(a);
    } catch (err) {
      setError('Failed to fetch vendor details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading vendor details...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!vendor) return <div style={{ padding: '2rem' }}>Vendor not found</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/vendors')} style={{ padding: '0.5rem', background: 'var(--bg-main)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>{vendor.name} ({vendor.vendorCode})</h1>
        </div>
      </header>

      <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Vendor Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-secondary)' }}>
          <div><strong>Company:</strong> {vendor.companyName}</div>
          <div><strong>Email:</strong> {vendor.email}</div>
          <div><strong>Phone:</strong> {vendor.phone || 'N/A'}</div>
          <div><strong>Address:</strong> {vendor.address || 'N/A'}</div>
          <div><strong>Registered On:</strong> {new Date(vendor.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Assets Supplied</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name / Model</th>
              <th>Type</th>
              <th>Serial No.</th>
              <th>Status</th>
              <th>Purchase Cost</th>
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
                  <span className={`${styles.badge}`}>
                    {asset.status.replace('_', ' ')}
                  </span>
                </td>
                <td>₹{asset.purchaseCost}</td>
              </tr>
            ))}
            {(!assetsPage?.content || assetsPage.content.length === 0) && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No assets found from this vendor.</td>
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
      </div>
    </div>
  );
};

export default VendorDetailPage;
