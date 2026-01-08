import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Package,
  TrendingUp,
  Filter,
  Search,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { adminApi } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface ShopItem {
  id: string;
  name: string;
  description?: string;
  image?: string;
  category: string;
  pointType: 'PARTICIPATION' | 'TRUST' | 'LABOR';
  pointCost: number;
  stock: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  exchangeCount: number;
}

interface ShopStatistics {
  totalItems: number;
  activeItems: number;
  inactiveItems: number;
  totalExchanges: number;
  categoryStats: Array<{ category: string; count: number }>;
  pointTypeStats: Array<{ pointType: string; count: number; totalCost: number }>;
}

const AdminShopPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [statistics, setStatistics] = useState<ShopStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['VIP', 'Physical Goods', 'Virtual Items', 'Premium Features'];
  const pointTypes = [
    { value: 'PARTICIPATION', label: 'Participation Points', color: 'text-blue-600' },
    { value: 'TRUST', label: 'Trust Points', color: 'text-green-600' },
    { value: 'LABOR', label: 'Labor Points', color: 'text-purple-600' },
  ];

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, statsRes] = await Promise.all([
        adminApi.get('/admin/shop/items', {
          params: {
            page,
            limit: 20,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            isActive: selectedStatus !== 'all' ? selectedStatus === 'active' : undefined,
          },
        }),
        adminApi.get('/admin/shop/statistics'),
      ]);

      setItems(itemsRes.data.items || []);
      setTotalPages(itemsRes.data.pagination?.totalPages || 1);
      setStatistics(statsRes.data.data);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, selectedCategory, selectedStatus]);

  // Create item
  const handleCreateItem = async (formData: any) => {
    try {
      const response = await adminApi.post('/admin/shop/items', formData);
      toast.success('Item created successfully');
      setShowCreateModal(false);
      loadData();
      return response.data; // Return response data including item ID
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Creation failed');
      throw error;
    }
  };

  // Update item
  const handleUpdateItem = async (itemId: string, formData: any) => {
    try {
      await adminApi.put(`/admin/shop/items/${itemId}`, formData);
      toast.success('Item updated successfully');
      setEditingItem(null);
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? If there are exchange records, the item will be delisted instead of deleted.')) {
      return;
    }

    try {
      await adminApi.delete(`/admin/shop/items/${itemId}`);
      toast.success('Operation successful');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Toggle item status
  const handleToggleStatus = async (itemId: string, isActive: boolean) => {
    try {
      await adminApi.put(`/admin/shop/items/${itemId}`, { isActive: !isActive });
      toast.success(isActive ? 'Item delisted' : 'Item listed');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Upload item image
  const handleImageUpload = async (itemId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      await adminApi.post(`/admin/shop/items/${itemId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Image uploaded successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getPointTypeInfo = (pointType: string) => {
    return pointTypes.find(pt => pt.value === pointType) || pointTypes[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <ShoppingCart className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Points Shop Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </button>
              <span className="text-sm text-gray-600">Welcome, {user?.fullName || 'Admin'}</span>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Items</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.activeItems}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <EyeOff className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive Items</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.inactiveItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Exchanges</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalExchanges}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Items</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter item name..."
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSearchTerm('');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exchanges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const pointTypeInfo = getPointTypeInfo(item.pointType);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {item.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={item.image}
                                alt={item.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {item.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.pointCost}</div>
                        <div className={`text-xs ${pointTypeInfo.color}`}>
                          {pointTypeInfo.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.stock === -1 ? 'Unlimited' : item.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.exchangeCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <label className="cursor-pointer text-gray-600 hover:text-gray-900">
                            <Upload className="h-4 w-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(item.id, file);
                                }
                              }}
                            />
                          </label>
                          
                          <button
                            onClick={() => handleToggleStatus(item.id, item.isActive)}
                            className={item.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Items</h3>
              <p className="text-gray-600">No items have been added yet</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="px-3 py-2 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Item Modal */}
      {(showCreateModal || editingItem) && (
        <ItemModal
          item={editingItem}
          categories={categories}
          pointTypes={pointTypes}
          onSave={editingItem ?
            (data: any) => handleUpdateItem(editingItem.id, data) :
            handleCreateItem
          }
          onClose={() => {
            setShowCreateModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

// Item Create/Edit Modal Component
const ItemModal = ({ item, categories, pointTypes, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category: item?.category || categories[0],
    pointType: item?.pointType || 'PARTICIPATION',
    pointCost: item?.pointCost || 100,
    stock: item?.stock || -1,
    isActive: item?.isActive ?? true,
    sortOrder: item?.sortOrder || 0,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Save item basic info first
      const result = await onSave(formData);

      // If image is selected and it's a new item, upload image
      if (selectedImage && !item) {
        const itemId = result?.data?.id;
        if (itemId) {
          const imageFormData = new FormData();
          imageFormData.append('image', selectedImage);

          await adminApi.post(`/admin/shop/items/${itemId}/image`, imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to save item:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {item ? 'Edit Item' : 'Add Item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Item Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <div className="flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Item Preview"
                    className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="mr-2 h-4 w-4" />
                  {imagePreview ? 'Change Image' : 'Select Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">Supports JPG, PNG formats, max 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category: string) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Point Type</label>
              <select
                value={formData.pointType}
                onChange={(e) => setFormData({ ...formData, pointType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {pointTypes.map((pt: any) => (
                  <option key={pt.value} value={pt.value}>{pt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Point Cost</label>
              <input
                type="number"
                value={formData.pointCost}
                onChange={(e) => setFormData({ ...formData, pointCost: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock (-1=Unlimited)</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Activate Immediately</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminShopPage;
