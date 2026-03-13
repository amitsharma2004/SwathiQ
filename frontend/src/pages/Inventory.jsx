import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMedicines, getInventoryOverview, addMedicine } from '../api/inventory';
import { getDashboardSummary } from '../api/dashboard';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { DollarIcon, PackageIcon, AlertTriangleIcon, ClipboardIcon, GridIcon, ShoppingCartIcon } from '../components/Icons';

function Inventory() {
  const [medicines, setMedicines] = useState([]);
  const [overview, setOverview] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    generic_name: '',
    category: '',
    batch_no: '',
    expiry_date: '',
    quantity: '',
    cost_price: '',
    mrp: '',
    supplier: ''
  });

  useEffect(() => {
    loadInventoryData();
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [searchQuery, statusFilter]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewData, summaryData] = await Promise.all([
        getInventoryOverview(),
        getDashboardSummary()
      ]);
      setOverview(overviewData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMedicines = async () => {
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      const data = await getMedicines(params);
      setMedicines(data);
    } catch (err) {
      console.error('Error loading medicines:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const medicineData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        cost_price: parseFloat(formData.cost_price),
        mrp: parseFloat(formData.mrp)
      };
      await addMedicine(medicineData);
      setShowModal(false);
      setFormData({
        name: '',
        generic_name: '',
        category: '',
        batch_no: '',
        expiry_date: '',
        quantity: '',
        cost_price: '',
        mrp: '',
        supplier: ''
      });
      loadMedicines();
      loadInventoryData();
    } catch (err) {
      alert('Error adding medicine: ' + err.message);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadInventoryData} />;
  }

      return (
    <div style={{ padding: '24px' }}>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <StatCard
          icon={<DollarIcon size={24} />}
          label="Today's Sales"
          value={formatCurrency(summary?.today_sales || 0)}
          badge={`${summary?.sales_change_percent >= 0 ? '+' : ''}${summary?.sales_change_percent || 0}%`}
          badgeColor="green"
          iconBg="green"
        />
        <StatCard
          icon={<PackageIcon size={24} />}
          label="Items Sold Today"
          value={summary?.items_sold_today || 0}
          badge="Today"
          badgeColor="green"
          iconBg="blue"
        />
        <StatCard
          icon={<AlertTriangleIcon size={24} />}
          label="Low Stock Items"
          value={summary?.low_stock_count || 0}
          badge="Action Needed"
          badgeColor="orange"
          iconBg="orange"
        />
        <StatCard
          icon={<ClipboardIcon size={24} />}
          label="Purchase Orders"
          value={formatCurrency(summary?.purchase_orders_value || 0)}
          badge={`${summary?.purchase_orders_count || 0} ${summary?.purchase_orders_status || 'Pending'}`}
          badgeColor="purple"
          iconBg="purple"
        />
      </div>

      {/* Inventory Overview */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '20px'
        }}>
          Inventory Overview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GridIcon size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {overview?.total_items || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Items</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingCartIcon size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {overview?.active_stock || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Active Stock</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangleIcon size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {overview?.low_stock || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Low Stock</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#A855F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarIcon size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                {formatCurrency(overview?.total_value || 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Total Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Inventory Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827'
          }}>
            Complete Inventory
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              🔍 Filter
            </button>
            <button style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              📤 Export
            </button>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Add Medicine
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '14px'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Expired">Expired</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        <div style={{
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB' }}>
                {['Medicine Name', 'Generic Name', 'Category', 'Batch No', 'Expiry Date', 'Quantity', 'Cost Price', 'MRP', 'Supplier', 'Status'].map(header => (
                  <th key={header} style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    borderBottom: '1px solid #E5E7EB',
                    whiteSpace: 'nowrap'
                  }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '14px'
                  }}>
                    No medicines found
                  </td>
                </tr>
              ) : (
                medicines.map((medicine, index) => (
                  <tr
                    key={medicine.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                      borderBottom: '1px solid #E5E7EB'
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                      {medicine.name}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                      {medicine.generic_name || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                      {medicine.category || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                      {medicine.batch_no || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                      {formatDate(medicine.expiry_date)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                      {medicine.quantity}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                      {formatCurrency(medicine.cost_price)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                      {formatCurrency(medicine.mrp)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>
                      {medicine.supplier || '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={medicine.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px',
            width: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Add New Medicine
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Generic Name
                  </label>
                  <input
                    type="text"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Batch No
                  </label>
                  <input
                    type="text"
                    name="batch_no"
                    value={formData.batch_no}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Cost Price *
                  </label>
                  <input
                    type="number"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    MRP *
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Supplier
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#22C55E',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
