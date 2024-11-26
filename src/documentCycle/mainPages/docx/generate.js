// src/components/QuillEditor.js
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ onContentChange, onTitleChange }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow', // or 'bubble'
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    });

    // Track changes in the main content
    quill.on('text-change', () => {
      const content = quill.root.innerHTML;
      if (typeof onContentChange === 'function') {
        onContentChange(content);
      }
    });

    // Add an additional field (e.g., title)
    const titleInput = document.createElement('input');
    titleInput.setAttribute('placeholder', 'Enter Title');
    titleInput.classList.add('quill-title-input');

    // Append the title input to the Quill container
    quill.container.appendChild(titleInput);

    // Track changes in the title field
    titleInput.addEventListener('input', () => {
      const title = titleInput.value;
      if (typeof onTitleChange === 'function') {
        onTitleChange(title);
      }
    });

    return () => {
      // Cleanup can be handled by React when the component unmounts.
      // Quill will automatically clean up its event listeners.
    };
  }, [onContentChange, onTitleChange]);

  return <div ref={quillRef} style={{ height: '400px' }} />;
};

export default QuillEditor;