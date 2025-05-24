import React from 'react';
import { Lead } from '../../types';
import Card, { CardHeader, CardBody, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { getLeadStageColor, formatDate, isDatePast, getUrgencyClass, daysUntil } from '../../utils/helpers';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onStageChange?: (id: string, stage: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onStageChange }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-1">{lead.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1">{lead.company}</p>
        </div>
        <Badge className={getLeadStageColor(lead.stage)}>{lead.stage}</Badge>
      </CardHeader>
      <CardBody className="flex-1">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Contact</p>
            <p className="text-sm text-gray-800">{lead.contact}</p>
          </div>
          {lead.productInterest && (
            <div>
              <p className="text-sm font-medium text-gray-500">Product Interest</p>
              <p className="text-sm text-gray-800">{lead.productInterest}</p>
            </div>
          )}
          {lead.followUpDate && (
            <div>
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" /> Follow-up
              </p>
              <p className={`text-sm ${isDatePast(lead.followUpDate) ? 'text-red-600' : getUrgencyClass(daysUntil(lead.followUpDate))}`}>
                {formatDate(lead.followUpDate)} ({daysUntil(lead.followUpDate)} days)
              </p>
            </div>
          )}
          {lead.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm text-gray-600 line-clamp-2">{lead.notes}</p>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Added: {formatDate(lead.createdAt)}
        </div>
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className="p-1.5"
            onClick={() => onEdit(lead)}
            aria-label="Edit"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="p-1.5 text-red-600 hover:bg-red-50"
            onClick={() => onDelete(lead.id)}
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LeadCard;