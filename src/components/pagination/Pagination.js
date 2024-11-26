import React from 'react';
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    return (
      <nav aria-label="Page navigation example">
        <ul className="inline-flex space-x-2 text-base h-5">
          <li>
            <button
              type="button"
              className="flex items-center justify-center mr-[12px] leading-tight text-gray-400 border-1 border-gray-400 hover:border-black rounded-lg hover:text-black dark:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-100 dark:hover:text-black"
              onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
            >
              <MdNavigateBefore size={20}/>
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className='flex items-center justify-center mx-1 '>
              <button
                type="button"
                style={{fontSize: '13px', lineHeight: '18px'}}
                className={`block py-[4px] px-[11px] leading-tight rounded-sm ${
                  number === currentPage
                    ? 'text-gray-900 bg-[#EBF6FF]'
                    : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-black dark:bg-gray-100 dark:border-gray-700 dark:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-black'
                }`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="flex items-center justify-center ml-[6px] leading-tight text-gray-500 border-1 border-gray-400 rounded-lg hover:border-black hover:text-black dark:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-100 dark:hover:text-black"
              onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
            >
              <MdNavigateNext size={20} />
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  export default Pagination;