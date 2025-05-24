import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order, OrderStage, Lead } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Save, X } from 'lucide-react';

interface OrderFormProps {
  order?: Order;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onClose }) => {
  const { addOrder, updateOrder, leads } = useAppContext();
  const [formData, setFormData] = useState<Partial<Order>>(
    order || {
      leadId: '',
      leadName: '',
      stage: 'Order Received' as OrderStage,
      details: '',
      courier: '',
      trackingNumber: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // If changing the lead, update the leadName as well
    if (name === 'leadId') {
      const selectedLead = leads.find(lead => lead.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        leadName: selectedLead?.name || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.leadId) {
      newErrors.leadId = 'Lead is required';
    }

    if (formData.stage === 'Dispatched' && !formData.courier) {
      newErrors.courier = 'Courier is required for dispatched orders';
    }

    if (formData.stage === 'Dispatched' && !formData.trackingNumber) {
      newErrors.trackingNumber = 'Tracking number is required for dispatched orders';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (order) {
      updateOrder(order.id, formData);
    } else {
      addOrder(formData as Omit<Order, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  const orderStageOptions = [
    { value: 'Order Received', label: 'Order Received' },
    { value: 'In Development', label: 'In Development' },
    { value: 'Ready to Dispatch', label: 'Ready to Dispatch' },
    { value: 'Dispatched', label: 'Dispatched' },
  ];

  // Only show won leads as options
  const leadOptions = leads
    .filter(lead => lead.stage === 'Won')
    .map(lead => ({
      value: lead.id,
      label: `${lead.name} (${lead.company})`,
    }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Associated Lead"
        name="leadId"
        value={formData.leadId || ''}
        onChange={handleChange}
        options={leadOptions}
        error={errors.leadId}
        disabled={!!order} // Can't change the lead once the order is created
        required
      />
      
      <Select
        label="Order Stage"
        name="stage"
        value={formData.stage || 'Order Received'}
        onChange={handleChange}
        options={orderStageOptions}
        required
      />
      
      <TextArea
        label="Order Details"
        name="details"
        value={formData.details || ''}
        onChange={handleChange}
        placeholder="Product specifications, special requirements, etc."
      />
      
      {(formData.stage === 'Ready to Dispatch' || formData.stage === 'Dispatched') && (
        <>
          <Input
            label="Courier"
            name="courier"
            value={formData.courier || ''}
            onChange={handleChange}
            error={errors.courier}
            placeholder="Shipping company name"
          />
          
          <Input
            label="Tracking Number"
            name="trackingNumber"
            value={formData.trackingNumber || ''}
            onChange={handleChange}
            error={errors.trackingNumber}
            placeholder="Tracking or reference number"
          />
        </>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          leftIcon={<X size={16} />}
        >
          Cancel
        </Button>
        <Button type="submit" leftIcon={<Save size={16} />}>
          {order ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;