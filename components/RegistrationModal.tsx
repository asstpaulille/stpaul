import React from 'react';
import Modal from './Modal';
import RegistrationForm from './RegistrationForm';
import { UserPlus } from './Icons';
import { Member } from '../types';

interface RegistrationModalProps {
  onClose: () => void;
  onAddMember: (member: Omit<Member, 'id' | 'registrationDate'>) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onAddMember }) => {
  const title = (
    <div className="flex items-center">
        <UserPlus className="w-6 h-6 mr-2" />
        <span>Bulletin d'Inscription</span>
    </div>
  );

  return (
    <Modal onClose={onClose} title={title}>
      <RegistrationForm onAddMember={onAddMember} onCloseModal={onClose} />
    </Modal>
  );
};

export default RegistrationModal;