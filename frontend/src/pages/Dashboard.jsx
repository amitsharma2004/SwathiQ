import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary, getRecentSales } from '../api/dashboard';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { DollarIcon, PackageIcon, AlertTriangleIcon, ClipboardIcon } from '../components/Icons';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sales');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryData, salesData] = await Promise.all([
        getDashboardSummary(),
        getRecentSales()
      ]);
      setSummary(summaryData);
      setRecentSales(salesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDashboardData} />;
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
          badge={`${recentSales.length} Orders`}
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

      {/* Tab Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          {['sales', 'purchase', 'inventory'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === tab ? '#3B82F6' : '#6B7280',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: activeTab === tab ? '2px solid #3B82F6' : 'none',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + New Sale
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
            + New Purchase
          </button>
        </div>
      </div>

      {/* Make a Sale Section */}
      {activeTab === 'sales' && (
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
            Make a Sale
          </h3>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              placeholder="Patient ID"
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px'
              }}
            />
            <input
              type="text"
              placeholder="Search medicines"
              style={{
                flex: 2,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px'
              }}
            />
            <button style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Order
            </button>
          </div>

          <div style={{
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  {['Medicine Name', 'Generic Name', 'Batch No', 'Expiry Date', 'Quantity', 'MRP/Price', 'Supplier', 'Status', 'Actions'].map(header => (
                    <th key={header} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="9" style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#9CA3AF',
                    fontSize: '14px'
                  }}>
                    No items added yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button style={{
              padding: '10px 32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F97316',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Bill
            </button>
          </div>
        </div>
      )}

      {/* Recent Sales Section */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '20px'
        }}>
          Recent Sales
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentSales.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#9CA3AF',
              fontSize: '14px'
            }}>
              No recent sales
            </div>
          ) : (
            recentSales.map(sale => (
              <div
                key={sale.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🛒
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {sale.invoice_no}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6B7280'
                    }}>
                      {sale.patient_name || 'Walk-in Customer'} • {sale.items_count} Items • {sale.payment_mode}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {formatCurrency(sale.total_amount)}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280'
                    }}>
                      {formatDate(sale.created_at)}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A'
                  }}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
