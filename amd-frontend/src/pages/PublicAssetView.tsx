import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicAssetService } from '../services/publicAssetService';
import type { PublicAssetResponse } from '../services/publicAssetService';
import { Train, Package, Tag, Building2, MapPin, Hash, Activity } from 'lucide-react';

const PublicAssetView: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const [asset, setAsset] = useState<PublicAssetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAsset = async () => {
      if (!assetId) return;
      try {
        const data = await publicAssetService.getAssetById(assetId);
        setAsset(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Asset not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [assetId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
        <div style={{ color: 'var(--railway-blue)', fontSize: '1.25rem' }}>Loading asset information...</div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '1rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <Package size={48} color="var(--status-repair)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Asset Not Found</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'var(--status-active)';
      case 'IN_USE': return 'var(--railway-blue)';
      case 'UNDER_REPAIR': return 'var(--status-repair)';
      case 'DISPOSED': return 'gray';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', marginTop: '2rem' }}>
        <div style={{ background: 'var(--railway-blue)', padding: '1.5rem', color: 'white', textAlign: 'center' }}>
          <Train size={48} style={{ marginBottom: '1rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{asset.name}</h1>
          <div style={{ opacity: 0.8, marginTop: '0.5rem', fontSize: '0.875rem' }}>East Central Railway</div>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <Tag size={20} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Asset Type</div>
                <div style={{ fontWeight: 500 }}>{asset.assetType}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <Hash size={20} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Serial Number</div>
                <div style={{ fontWeight: 500 }}>{asset.serialNumber}</div>
              </div>
            </div>

            {(asset.brand || asset.model) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <Package size={20} color="var(--text-secondary)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Brand / Model</div>
                  <div style={{ fontWeight: 500 }}>{asset.brand} {asset.model}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <Building2 size={20} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Department</div>
                <div style={{ fontWeight: 500 }}>{asset.department || 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <MapPin size={20} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Location</div>
                <div style={{ fontWeight: 500 }}>{asset.location || 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Activity size={20} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Status</div>
                <div style={{ 
                  display: 'inline-block',
                  marginTop: '0.25rem',
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  backgroundColor: getStatusColor(asset.status) + '20',
                  color: getStatusColor(asset.status),
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  {asset.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicAssetView;
