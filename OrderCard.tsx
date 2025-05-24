import React from 'react';
import { Order } from '../../types';
import Card, { CardHeader, CardBody, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit, Trash2, Package, ExternalLink } from 'lucide-react';
import { getOrderStageColor, formatDate } from '../../utils/helpers';

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onStageChange?: (id: string, stage: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onEdit, onDelete, onStageChange }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-1">{order.leadName}</h3>
          <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
        </div>
        <Badge className={getOrderStageColor(order.stage)}>{order.stage}</Badge>
      </CardHeader>
      <CardBody className="flex-1">
        <div className="space-y-3">
          {order.details && (
            <div>
              <p className="text-sm font-medium text-gray-500">Details</p>
              <p className="text-sm text-gray-800">{order.details}</p>
            </div>
          )}
          
          {order.courier && (
            <div>
              <p className="text-sm font-medium text-gray-500">Courier</p>
              <p className="text-sm text-gray-800">{order.courier}</p>
            </div>
          )}
          
          {order.trackingNumber && (
            <div>
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <Package size={14} className="mr-1" /> Tracking
              </p>
              <p className="text-sm text-indigo-600 flex items-center">
                {order.trackingNumber}
                {order.stage === 'Dispatched' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 p-1"
                    onClick={() => window.open(`https://track.aftership.com/all/${order.trackingNumber}`, '_blank')}
                  >
                    <ExternalLink size={12} />
                  </Button>
                )}
              </p>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Created: {formatDate(order.createdAt)}
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className="p-1.5"
            onClick={() => onEdit(order)}
            aria-label="Edit"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="p-1.5 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(order.id)}
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;