import React from 'react';

const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">Profile</h3>
        <div className="py-4">
          <div className="mb-2"><strong>Name:</strong> {((user?.firstName || '') + ' ' + (user?.lastName || '')).trim() || user?.fullName || user?.name || '—'}</div>
          <div className="mb-2"><strong>Email:</strong> {user?.email || '—'}</div>
          <div className="mb-2"><strong>Role:</strong> {user?.role || '—'}</div>
          {user?.office && <div className="mb-2"><strong>Office:</strong> {user.office}</div>}
          {user?.phone && <div className="mb-2"><strong>Phone:</strong> {user.phone}</div>}
          <div className="text-sm text-muted">ID: {user?._id || user?.id || '—'}</div>
        </div>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
