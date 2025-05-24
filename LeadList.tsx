import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import LeadCard from './LeadCard';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LeadForm from './LeadForm';
import { Plus, List, Grid3X3, Filter } from 'lucide-react';
import { Lead, LeadStage } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';

const LeadList: React.FC = () => {
  const { leads, deleteLead, updateLeadStage } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<LeadStage | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(undefined);
  };

  const handleAddNew = () => {
    setSelectedLead(undefined);
    setIsModalOpen(true);
  };

  const filteredLeads = leads
    .filter((lead) => filter === 'All' || lead.stage === filter)
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.contact.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const leadStageOptions = [
    { value: 'All', label: 'All Stages' },
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal Sent', label: 'Proposal Sent' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
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
            Add Lead
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-2/3">
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Select
            options={leadStageOptions}
            value={filter}
            onChange={(e) => setFilter(e.target.value as LeadStage | 'All')}
            className="w-full"
            leftIcon={<Filter size={16} />}
          />
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No leads found. Add a new lead to get started.</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={handleAddNew}
            leftIcon={<Plus size={16} />}
          >
            Add Lead
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onStageChange={updateLeadStage}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Follow Up
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.company}</div>
                    {lead.productInterest && (
                      <div className="text-sm text-gray-500">{lead.productInterest}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.stage === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.stage === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                      lead.stage === 'Qualified' ? 'bg-indigo-100 text-indigo-800' :
                      lead.stage === 'Proposal Sent' ? 'bg-yellow-100 text-yellow-800' :
                      lead.stage === 'Won' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.followUpDate ? (
                      <div className={`text-sm ${isDatePast(lead.followUpDate) ? 'text-red-600' : 'text-gray-500'}`}>
                        {new Date(lead.followUpDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      size="sm"
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleEditLead(lead)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteLead(lead.id)}
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
        title={selectedLead ? 'Edit Lead' : 'Add New Lead'}
        size="lg"
      >
        <LeadForm lead={selectedLead} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default LeadList;