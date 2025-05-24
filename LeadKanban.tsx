import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Lead, LeadStage } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LeadForm from './LeadForm';
import { Plus, Move, Calendar } from 'lucide-react';
import { getLeadStageColor, formatDate, daysUntil, isDatePast, getUrgencyClass } from '../../utils/helpers';

const LeadKanban: React.FC = () => {
  const { leads, updateLeadStage, deleteLead } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    updateLeadStage(id, stage);
    setDraggingId(null);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAddLead = (stage: LeadStage) => {
    setSelectedLead({ 
      id: '', 
      name: '', 
      contact: '', 
      company: '', 
      productInterest: '', 
      stage,
      createdAt: '',
      updatedAt: '' 
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(undefined);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
      </div>

      <div className="flex overflow-x-auto pb-4 space-x-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage);
          return (
            <div
              key={stage}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">
                  {stage} <span className="text-gray-500 text-sm ml-1">({stageLeads.length})</span>
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddLead(stage)}
                  className="p-1"
                >
                  <Plus size={16} />
                </Button>
              </div>

              <div className="space-y-3">
                {stageLeads.length === 0 ? (
                  <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm">
                    Drop leads here
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className={`cursor-move ${draggingId === lead.id ? 'opacity-50' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => handleEditLead(lead)}
                    >
                      <div className="p-3 space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 line-clamp-1">{lead.name}</h4>
                          <Move size={16} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-1">{lead.company}</p>
                        
                        {lead.followUpDate && (
                          <div className="flex items-center text-xs">
                            <Calendar size={12} className="mr-1" />
                            <span className={getUrgencyClass(daysUntil(lead.followUpDate))}>
                              {formatDate(lead.followUpDate)}
                            </span>
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
        title={selectedLead?.id ? 'Edit Lead' : 'Add New Lead'}
        size="lg"
      >
        <LeadForm lead={selectedLead} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default LeadKanban;