import React from 'react'
import { currency } from '../App'
import { toast } from 'react-toastify'
import DataTable from '../components/DataTable'
import { Package } from 'lucide-react'
import { useOrders, useUpdateOrderStatus } from '../hooks/useApi'

const Orders = ({ token }) => {
  const { data: orders = [], isLoading } = useOrders()
  const updateStatusMutation = useUpdateOrderStatus()

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    updateStatusMutation.mutate({ orderId, status: newStatus })
  }

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  const getStatusColor = (status) => {
    const colors = {
      'Đã nhận đơn': 'bg-blue-100 text-blue-700',
      'Đang đóng gói': 'bg-yellow-100 text-yellow-700',
      'Đã gửi đi': 'bg-purple-100 text-purple-700',
      'Đang trên đường': 'bg-orange-100 text-orange-700',
      'Đã giao hàng thành công': 'bg-primary-50 text-primary-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    {
      header: 'Đơn hàng',
      key: 'items',
      accessor: (order) => order.items.length,
      render: (order) => (
        <div className="flex items-start gap-3">
          <Package className="w-10 h-10 text-gray-400 flex-shrink-0" />
          <div className="text-xs">
            {order.items.map((item, index) => (
              <p key={index} className="py-0.5">
                {item.name} x {item.quantity}
                {index < order.items.length - 1 && ','}
              </p>
            ))}
          </div>
        </div>
      ),
      sortable: false,
      searchable: true,
    },
    {
      header: 'Khách hàng',
      key: 'customer',
      accessor: (order) => order.address.firstName + ' ' + order.address.lastName,
      render: (order) => (
        <div className="text-xs">
          <p className="font-medium text-gray-900">{order.address.firstName} {order.address.lastName}</p>
          <p className="text-gray-600 mt-1">{order.address.phone}</p>
          <p className="text-gray-500 mt-1">
            {order.address.street}, {order.address.city}
          </p>
        </div>
      ),
      sortable: true,
      searchable: true,
    },
    {
      header: 'Số lượng',
      key: 'quantity',
      accessor: (order) => order.items.length,
      render: (order) => (
        <span className="font-medium">{order.items.length} items</span>
      ),
      sortable: true,
      searchable: false,
    },
    {
      header: 'Tổng tiền',
      key: 'amount',
      accessor: (order) => order.amount,
      render: (order) => (
        <span className="font-medium text-primary-700">{order.amount.toLocaleString('vi-VN')} {currency}</span>
      ),
      sortable: true,
      searchable: false,
    },
    {
      header: 'Thanh toán',
      key: 'payment',
      accessor: (order) => order.payment ? 'Done' : 'Pending',
      render: (order) => (
        <div className="text-xs ">
          <p className='text-center'>{order.paymentMethod}</p>
          <span className={`inline-block px-2 py-1 text-center  rounded text-xs font-medium mt-1 ${order.payment ? 'bg-primary-50 text-primary-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {order.payment ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </span>
        </div>
      ),
      sortable: true,
      searchable: false,
    },
    {
      header: 'Ngày đặt',
      key: 'date',
      accessor: (order) => order.date,
      render: (order) => (
        <span className="text-xs text-gray-600">{new Date(order.date).toLocaleDateString('vi-VN')}</span>
      ),
      sortable: true,
      searchable: false,
    },
    {
      header: 'Trạng thái',
      key: 'status',
      accessor: (order) => order.status,
      render: (order) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      ),
      sortable: true,
      searchable: true,
    },
    {
      header: 'Cập nhật',
      key: 'action',
      accessor: () => '',
      render: (order) => (
        <select
          onChange={(event) => statusHandler(event, order._id)}
          value={order.status}
          className='p-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary'
        >
          <option value="Đã nhận đơn">Đã nhận đơn</option>
          <option value="Đang đóng gói">Đang đóng gói</option>
          <option value="Đã gửi đi">Đã gửi đi</option>
          <option value="Đang trên đường">Đang trên đường</option>
          <option value="Đã giao hàng thành công">Đã giao hàng thành công</option>
        </select>
      ),
      sortable: false,
      searchable: false,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h2>
      <DataTable
        columns={columns}
        data={orders}
        itemsPerPage={10}
      />
    </div>
  )
}

export default Orders
