import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamation } from 'react-icons/hi';

const AuthRedirectModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose(); // Close the modal
    navigate('/login'); // Go to login page
  };

  return (
    // Main overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal container */}
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4">
        <div className="flex">
          {/* Warning Icon */}
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
            <HiOutlineExclamation className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4 text-left">
            {/* Title */}
            <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
              Login Required
            </h3>
            {/* Message */}
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                You must create an account or log in to have a cart to add and confirm orders. Want to log in?
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleLoginClick}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-violet-600 text-base font-medium text-white hover:bg-violet-700 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Yes, log in
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirectModal;