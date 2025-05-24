import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Lead, LeadStage } from '../../types';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Save, X } from 'lucide-react';

interface LeadFormProps {
  lead?: Lead;
  onClose: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose }) => {
  const { addLead, updateLead } = useAppContext();
  const [formData, setFormData] = useState<Partial<Lead>>(
    lead || {
      name: '',
      contact: '',
      company: '',
      productInterest: '',
      stage: 'New' as LeadStage,
      notes: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.contact?.trim()) {
      newErrors.contact = 'Contact information is required';
    }
    if (!formData.company?.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (lead) {
      updateLead(lead.id, formData);
    } else {
      addLead(formData as Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  const leadStageOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal Sent', label: 'Proposal Sent' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        error={errors.name}
        required
      />
      <Input
        label="Contact Information"
        name="contact"
        value={formData.contact || ''}
        onChange={handleChange}
        error={errors.contact}
        placeholder="Email or phone number"
        required
      />
      <Input
        label="Company"
        name="company"
        value={formData.company || ''}
        onChange={handleChange}
        error={errors.company}
        required
      />
      <Input
        label="Product Interest"
        name="productInterest"
        value={formData.productInterest || ''}
        onChange={handleChange}
        placeholder="What product or service are they interested in?"
      />
      <Select
        label="Stage"
        name="stage"
        value={formData.stage || 'New'}
        onChange={handleChange}
        options={leadStageOptions}
      />
      {(formData.stage === 'Contacted' || formData.stage === 'Qualified' || formData.stage === 'Proposal Sent') && (
        <Input
          type="date"
          label="Follow-up Date"
          name="followUpDate"
          value={formData.followUpDate || ''}
          onChange={handleChange}
        />
      )}
      <TextArea
        label="Notes"
        name="notes"
        value={formData.notes || ''}
        onChange={handleChange}
        placeholder="Any additional information..."
      />
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
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;