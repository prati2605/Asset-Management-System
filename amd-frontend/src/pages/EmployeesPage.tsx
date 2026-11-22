import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X,
  Package,
  Download
} from 'lucide-react';
import {
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  getEmployeeAssets
} from '../services/employeeService';
import { reportService } from '../services/reportService';
import { useAuth } from '../auth/AuthContext';
import type { EmployeeRequest } from '../types/employee';
import type { Employee } from '../types/api';
import type { Page } from '../types/asset';
import styles from './EmployeesPage.module.css';

const initialEmployeeForm: EmployeeRequest = {
  employeeCode: '',
  name: '',
  email: '',
  designation: '',
  department: '',
  phone: '',
  status: 'ACTIVE',
};

const EmployeesPage: React.FC = () => {
  const [employeesPage, setEmployeesPage] = useState<Page<Employee> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [keyword, setKeyword] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EmployeeRequest>(initialEmployeeForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Asset Assignment Modal State
  const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [assignedAssets, setAssignedAssets] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(page, size, keyword);
      if (response.success && response.data) {
        setEmployeesPage(response.data);
      }
    } catch (err: any) {
      setError('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchEmployees();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleViewAssets = async (emp: Employee) => {
    setSelectedEmployeeName(emp.name);
    setIsAssetsModalOpen(true);
    setLoadingAssets(true);
    try {
      const response = await getEmployeeAssets(emp.id);
      if (response.success && response.data) {
        setAssignedAssets(response.data);
      }
    } catch (err) {
      alert('Failed to load assigned assets');
    } finally {
      setLoadingAssets(false);
    }
  };

  const openModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      setFormData({
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        designation: employee.designation || '',
        department: employee.department || '',
        phone: employee.phoneNumber || '',
        status: employee.status || 'ACTIVE',
      });
    } else {
      setEditingId(null);
      setFormData(initialEmployeeForm);
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateEmployee(editingId, formData);
      } else {
        await createEmployee(formData);
      }
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Employee Management</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn" onClick={() => reportService.downloadEmployeesReport()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)' }}>
            <Download size={18} /> Export
          </button>
          {user?.role !== 'VIEWER' && (
            <button className="btn btn-primary" onClick={() => openModal()}>
              <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Employee
            </button>
          )}
        </div>
      </header>

      <div className={styles.searchBar}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by name, code, email..."
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
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading employees...</div>
        ) : error ? (
          <div style={{ padding: '2rem', color: 'red' }}>{error}</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name / Email</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeesPage?.content.map(emp => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 500 }}>{emp.employeeCode}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {emp.email}
                      </div>
                    </td>
                    <td>{emp.designation}</td>
                    <td>{emp.department}</td>
                    <td>{emp.phoneNumber}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {user?.role !== 'VIEWER' && (
                          <button className={styles.actionBtn} onClick={() => openModal(emp)} title="Edit">
                            <Edit size={16} />
                          </button>
                        )}
                        {user?.role !== 'VIEWER' && (
                          <button 
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`} 
                            onClick={() => handleDelete(emp.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button className={styles.actionBtn} title="Assigned Assets" onClick={() => handleViewAssets(emp)}>
                          <Package size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {employeesPage?.content.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {employeesPage && employeesPage.totalPages > 0 && (
              <div className={styles.pagination}>
                <div>
                  Showing {page * size + 1} to {Math.min((page + 1) * size, employeesPage.totalElements)} of {employeesPage.totalElements} entries
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
                  <span style={{ padding: '0 1rem' }}>Page {page + 1} of {employeesPage.totalPages}</span>
                  <button 
                    className="btn" 
                    style={{ padding: '0.5rem 1rem', background: 'var(--bg-main)' }}
                    disabled={employeesPage.last}
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
              <h2 className={styles.modalTitle}>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee Code *</label>
                  <input required className="input-field" value={formData.employeeCode} onChange={e => setFormData({...formData, employeeCode: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number *</label>
                  <input required className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Status *</label>
                  <select required className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Designation *</label>
                  <input required className="input-field" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department *</label>
                  <input required className="input-field" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssetsModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Assets Assigned to {selectedEmployeeName}</h2>
              <button className={styles.closeBtn} onClick={() => setIsAssetsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {loadingAssets ? (
                <div style={{ textAlign: 'center' }}>Loading assets...</div>
              ) : assignedAssets.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No assets assigned to this employee.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Asset Name</th>
                      <th>Type</th>
                      <th>Assigned Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedAssets.map((assignment: any) => (
                      <tr key={assignment.id}>
                        <td style={{ fontWeight: 500 }}>{assignment.assetName}</td>
                        <td>{assignment.assetType}</td>
                        <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${assignment.status.toLowerCase().replace('_', '-')}`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
