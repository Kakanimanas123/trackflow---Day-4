import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import OrderCard from './OrderCard';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import OrderForm from './OrderForm';
import { Plus, List, Grid3X3, Filter } from 'lucide-react';
import { Order, OrderStage } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { getOrderStageColor, formatDate } from '../../utils/helpers';

const OrderList: React.FC = () => {
  const { orders, deleteOrder, updateOrderStage } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<OrderStage | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(undefined);
  };

  const handleAddNew = () => {
    setSelectedOrder(undefined);
    setIsModalOpen(true);
  };

  const filteredOrders = orders
    .filter((order) => filter === 'All' || order.stage === filter)
    .filter(
      (order) =>
        order.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.details && order.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.courier && order.courier.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const orderStageOptions = [
    { value: 'All', label: 'All Stages' },
    { value: 'Order Received', label: 'Order Received' },
    { value: 'In Development', label: 'In Development' },
    { value: 'Ready to Dispatch', label: 'Ready to Dispatch' },
    { value: 'Dispatched', label: 'Dispatched' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
          </Button>
          <Button
            onClick={handleAddNew}
            leftIcon={<Plus size={16} />}
          >
            Add Order
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Select
            options={orderStageOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value as OrderStage | 'All')}
            className="w-full"
            leftIcon={<Filter size={16} />}
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No orders found. Convert a lead to "Won" or add a new order to get started.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={handleAddNew}
            leftIcon={<Plus size={16} />}
          >
            Add Order
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
              onStageChange={updateOrderStage}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipping
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.leadName}</div>
                    <div className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{order.details || '-'}</div>
                    <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getOrderStageColor(order.stage)}`}>
                      {order.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.courier && order.trackingNumber ? (
                      <>
                        <div className="text-sm text-gray-900">{order.courier}</div>
                        <div className="text-sm text-indigo-600">{order.trackingNumber}</div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not shipped</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      size="sm"
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleEditOrder(order)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedOrder ? 'Edit Order' : 'Add New Order'}
        size="lg"
      >
        <OrderForm order={selectedOrder} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default OrderList;