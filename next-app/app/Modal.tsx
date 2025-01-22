interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose} // Close modal on backdrop click
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg w-1/3 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

import { useState } from "react";

const Usage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Open Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-bold mb-4">Modal Title</h2>
        <p className="text-gray-700">
          This is a modal built with Tailwind CSS.
        </p>
      </Modal>
    </div>
  );
};

export default Usage;
