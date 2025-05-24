import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order, OrderStage } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import OrderForm from './OrderForm';
import { Plus, Move, Package } from 'lucide-react';
import { getOrderStageColor, formatDate } from '../../utils/helpers';

const OrderKanban: React.FC = () => {
  const { orders, updateOrderStage, deleteOrder } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const stages: OrderStage[] = ['Order Received', 'In Development', 'Ready to Dispatch', 'Dispatched'];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: OrderStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    updateOrderStage(id, stage);
    setDraggingId(null);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleAddOrder = () => {
    setSelectedOrder(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Pipeline</h1>
        <Button onClick={handleAddOrder} leftIcon={<Plus size={16} />}>
          Add Order
        </Button>
      </div>

      <div className="flex overflow-x-auto pb-4 space-x-4">
        {stages.map((stage) => {
          const stageOrders = orders.filter((order) => order.stage === stage);
          return (
            <div
              key={stage}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">
                  {stage} <span className="text-gray-500 text-sm ml-1">({stageOrders.length})</span>
                </h3>
              </div>

              <div className="space-y-3">
                {stageOrders.length === 0 ? (
                  <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm">
                    Drop orders here
                  </div>
                ) : (
                  stageOrders.map((order) => (
                    <Card
                      key={order.id}
                      className={`cursor-move ${draggingId === order.id ? 'opacity-50' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, order.id)}
                      onClick={() => handleEditOrder(order)}
                    >
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 line-clamp-1">{order.leadName}</h4>
                          <Move size={16} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">Order #{order.id.slice(0, 8)}</p>
                        
                        {order.courier && order.trackingNumber && (
                          <div className="flex items-center text-xs">
                            <Package size={12} className="mr-1" />
                            <span className="text-indigo-600">{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedOrder?.id ? 'Edit Order' : 'Add New Order'}
        size="lg"
      >
        <OrderForm order={selectedOrder} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default OrderKanban;