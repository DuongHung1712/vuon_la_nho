import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import Loading from '../components/Loading';
import { useUserOrders } from '../hooks/useApi';
import { Leaf, RefreshCw, Package, Calendar, CreditCard, CheckCircle, Clock, ShoppingBag, ClipboardList, Truck, Bike } from 'lucide-react';
import SEO from '../components/SEO';

const Orders = () => {
  const { currency } = useContext(ShopContext);
  const { data: orders = [], isLoading, refetch, isFetching } = useUserOrders();

  const orderData = useMemo(() => {
    const allOrdersItem = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        allOrdersItem.push({
          ...item,
          status: order.status,
          payment: order.payment,
          paymentMethod: order.paymentMethod,
          date: order.date,
        });
      });
    });
    return allOrdersItem.reverse();
  }, [orders]);

  const getStatusConfig = (status) => {
    const configs = {
      'Đã nhận đơn': {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <ClipboardList className="w-4 h-4" />,
        dotColor: 'bg-blue-500'
      },
      'Đang đóng gói': {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Package className="w-4 h-4" />,
        dotColor: 'bg-amber-500'
      },
      'Đã gửi đi': {
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: <Truck className="w-4 h-4" />,
        dotColor: 'bg-purple-500'
      },
      'Đang trên đường': {
        color: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <Bike className="w-4 h-4" />,
        dotColor: 'bg-orange-500'
      },
      'Đã giao hàng thành công': {
        color: 'bg-primary-50 text-primary-700 border-primary-200',
        icon: <CheckCircle className="w-4 h-4" />,
        dotColor: 'bg-primary-500'
      },
    };
    return configs[status] || {
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      icon: <ClipboardList className="w-4 h-4" />,
      dotColor: 'bg-gray-500'
    };
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='py-8'>
      <SEO noindex={true} title="Đơn hàng của tôi - Vườn Lá Nhỏ" />
      {/* Header */}
      <div className='mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <Title text1={'Đơn hàng'} text2={'của tôi'} />
            <p className='text-sm text-gray-500 mt-1'>
              {orderData.length} sản phẩm đã đặt
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className='inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 
                       rounded-lg border border-primary-200 text-sm font-medium 
                       hover:bg-primary-100 transition-colors disabled:opacity-50'
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
              strokeWidth={2}
            />
            {isFetching ? 'Đang tải...' : 'Cập nhật'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {orderData.length > 0 ? (
        <div className='space-y-4'>
          {orderData.map((item, index) => {
            const statusConfig = getStatusConfig(item.status);

            return (
              <div
                key={index}
                className='bg-white rounded-xl border border-primary-100 p-4 sm:p-5 
                           hover:border-primary-200 hover:shadow-sm transition-all duration-200'
              >
                <div className='flex flex-col sm:flex-row gap-4'>
                  {/* Product Image */}
                  <div className='flex-shrink-0'>
                    <img
                      className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-primary-100'
                      src={item.image[0]}
                      alt={item.name}
                    />
                  </div>

                  {/* Product Info */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium text-gray-800 text-base sm:text-lg line-clamp-1'>
                      {item.name}
                    </h3>

                    <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600'>
                      <span className='font-semibold text-primary-600'>
                        {item.price.toLocaleString('vi-VN')}{currency}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Package className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                        x{item.quantity}
                      </span>
                    </div>

                    <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500'>
                      <span className='flex items-center gap-1.5'>
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        {new Date(item.date).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                      <span className='flex items-center gap-1.5'>
                        <CreditCard className="w-4 h-4" strokeWidth={1.5} />
                        {item.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-3'>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${statusConfig.color}`}>
                      <span>{statusConfig.icon}</span>
                      {item.status}
                    </span>

                    {item.payment ? (
                      <span className='inline-flex items-center gap-1 text-xs text-primary-600 font-medium'>
                        <CheckCircle className="w-4 h-4" strokeWidth={2} />
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 text-xs text-amber-600 font-medium'>
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        Chờ thanh toán
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className='flex flex-col items-center justify-center py-16 text-center'>
          <div className='w-24 h-24 mb-4 text-primary-200'>
            <ShoppingBag className="w-full h-full" strokeWidth={0.5} />
          </div>
          <h3 className='text-lg font-medium text-gray-700 mb-2'>
            Chưa có đơn hàng nào
          </h3>
          <p className='text-sm text-gray-500 mb-4'>
            Hãy khám phá bộ sưu tập cây cảnh của chúng tôi!
          </p>
          <a
            href='/collection'
            className='px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors'
          >
            <Leaf /> Xem sản phẩm
          </a>
        </div>
      )}
    </div>
  )
}

export default Orders
