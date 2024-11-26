import React from 'react'

const Annotation = () => {

  const iframeStyle = {
    width: '600px',
    height: '400px',
    
  };
  return (

  <div class="bg-white">
    <div class="pt-0">
      <div class="mx-auto mt-4 max-w-3xl sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-x-40 lg:px-36">
        <div class="lg:grid lg:grid-cols-1 lg:gap-y-8">
           <div className="w-screen max-w-md flex-auto overflow-hidden  bg-white text-sm leading-6 ">
            <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
              <p className="mt-1 text-xl">Annotation Tools</p>
            </div>
            <div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 lg:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-add-text.svg' class="mr-2" alt="Icon"/>
      Add text
    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-line.svg' class="mr-2" alt="Icon"/>
      Brush Line Rectangle Circle
    </div>
  </dt>
</div>
<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-redact.svg' class="mr-2" alt="Icon"/>
      Whiteout Redact
    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-image.svg' class="mr-2" alt="Icon"/>
      Insert Image
    </div>
  </dt>
</div>
<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-highlight.svg' class="mr-2" alt="Icon"/>
      Highlight Underline Strikeout
    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-stamp.svg' class="mr-2" alt="Icon"/>
      Stamp
    </div>
  </dt>
</div>
<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-comment.svg' class="mr-2" alt="Icon"/>
      Comment

    </div>
  </dt>
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img  src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-add-initials.svg' class="mr-2" alt="Icon"/>
     Add signature Add initials

    </div>
  </dt>
</div>
          </div>
          <div className="w-screen max-w-md flex-auto overflow-hidden  bg-white text-sm leading-6 ">
            <div className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
              <p className="mt-1 text-xl">Form Field Tools</p>
            </div>
            <div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 lg:gap-4 sm:px-0">
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
<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-2 text-gray-900">
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
<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
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
<div class="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
  <dt class="text-sm font-medium leading-6 text-gray-900">
    <div class="flex items-center">
      <img src='https://cdn.mrkhub.com/dochub-frontend/103/images/_pages/old-main/icons/editor/icon-comment.svg' class="mr-2" alt="Icon"/>
      Checkbox

    </div>
  </dt>
  
</div>
</div>
        </div>
        {/* <div class="relative mt-20 h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
        <iframe    src='https://cdn.mrkhub.com/dochub-frontend/103/videos/_pages/old-main/editor-video.mp4'></iframe>
        </div> */}
 
 <div className='relative mt-40 sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64'>
  <iframe
    src='https://cdn.mrkhub.com/dochub-frontend/103/videos/_pages/old-main/editor-video.mp4'
        style={iframeStyle}
  ></iframe>
</div>


        
      </div>
  
      
 
      </div>
    </div>
    )
}

export default Annotation