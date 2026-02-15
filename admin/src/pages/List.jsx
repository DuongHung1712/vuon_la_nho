import React, { useState } from 'react'
import { currency } from '../App'
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'
import { useProducts, useRemoveProduct } from '../hooks/useApi'

const List = ({token}) => {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, productId: null })
  const navigate = useNavigate()

  const { data: products = [], isLoading } = useProducts()
  const removeProductMutation = useRemoveProduct()

  const handleDeleteClick = (item) => {
    setConfirmDialog({ isOpen: true, productId: item._id })
  }

  const handleConfirmDelete = () => {
    if (confirmDialog.productId) {
      removeProductMutation.mutate(confirmDialog.productId, {
        onSuccess: () => {
          setConfirmDialog({ isOpen: false, productId: null })
        }
      })
    }
  }

  const handleEditProduct = (product) => {
    navigate('/add', { state: { product } })
  }

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  const columns = [
    {
      header: 'Hình ảnh',
      key: 'image',
      accessor: (item) => item.image[0],
      render: (item) => (
        <img 
          src={item.image[0]} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded border border-gray-200"
        />
      ),
      sortable: false,
      searchable: false,
    },
    {
      header: 'Tên sản phẩm',
      key: 'name',
      accessor: (item) => item.name,
      sortable: true,
      searchable: true,
    },
    {
      header: 'Danh mục',
      key: 'category',
      accessor: (item) => item.category,
      render: (item) => (
        <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
          {item.category === 'indoor' ? 'Trong nhà' : 'Ngoài trời'}
        </span>
      ),
      sortable: true,
      searchable: true,
    },
    {
      header: 'Kích thước',
      key: 'size',
      accessor: (item) => item.size?.join(', ') || 'N/A',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.size && item.size.length > 0 ? (
            item.size.map((s, idx) => (
              <span key={idx} className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs">
                {s}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">N/A</span>
          )}
        </div>
      ),
      sortable: false,
      searchable: true,
    },
    {
      header: 'Giá',
      key: 'price',
      accessor: (item) => item.price,
      render: (item) => (
        <span className="font-medium">{item.price.toLocaleString('vi-VN')} {currency}</span>
      ),
      sortable: true,
      searchable: false,
    },
  ];

  // Define actions for DataTable
  const actions = [
    {
      icon: <Edit className="w-5 h-5" />,
      onClick: handleEditProduct,
      title: 'Chỉnh sửa',
      className: 'text-blue-600 hover:text-blue-700',
    },
    {
      icon: <Trash2 className="w-5 h-5" />,
      onClick: handleDeleteClick,
      title: 'Xóa',
      className: 'text-red-600 hover:text-red-700',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách sản phẩm</h2>
      <DataTable 
        columns={columns} 
        data={products} 
        actions={actions}
        itemsPerPage={10}
      />
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, productId: null })}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  )
}

export default List
