
import React from 'react'
import Annotation from './Annotation'
import Reorder from './Reorder'
import DropBox from './DropBox'
import DropBox2 from './DropBox2'


const PdfEdits = () => {
  return (
    <div className="relative mt-16">
       <p className="text-2xl text-center">
         Annotate PDFs and edit fields using powerful tools
        </p>
        <Annotation/>
        <Reorder/>
        <DropBox/>
        <DropBox2/>
       </div> 
        )
}

export default PdfEdits