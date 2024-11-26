import React from 'react';

const ActiveAccount = () => {
  return (
    <div className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32 ml-50 mt-20">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="w-full p-4 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-900 dark:border-gray-700">

          <div className="text-center p-6  flex items-center justify-center">
            <p className="text-lg font-bold mt-2 flex items-center justify-center">
              Please check your email
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-2">
                <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
            </p>
            </div>
            <p className="text-center mb-2">We have sent you an activation link.</p>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccount;
