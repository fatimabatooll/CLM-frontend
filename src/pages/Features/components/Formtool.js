import React from 'react'

const Formtool = () => {
  return (
    <>
       <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden  bg-white text-sm leading-6 ">
            <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
              <p className="mt-1 text-xl">Form Field Tools</p>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 lg:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-add-text.svg' class="mr-2" alt="Icon"/>
      Text
    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-line.svg' class="mr-2" alt="Icon"/>
      Paragraph

    </div>
  </dt>
</div>
<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-redact.svg' class="mr-2" alt="Icon"/>
      Dropdown
    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-image.svg' class="mr-2" alt="Icon"/>
      Signature
    </div>
  </dt>
</div>
<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-highlight.svg' class="mr-2" alt="Icon"/>
      Initials
    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-stamp.svg' class="mr-2" alt="Icon"/>
      Date
    </div>
  </dt>
</div>
<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-comment.svg' class="mr-2" alt="Icon"/>
      Checkbox

    </div>
  </dt>
  
</div>
          </div>
          
        </div>
    </>
  )
}

export default Formtool