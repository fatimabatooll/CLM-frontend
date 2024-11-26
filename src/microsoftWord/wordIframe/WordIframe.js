import React, { useState, useEffect, useRef } from 'react';

const WordIframe = () => {
    return (
        <div>
            <h2>Document Viewer</h2>
            ﻿

            <iframe src="https://xloop-my.sharepoint.com/personal/ifra_saleem_xloopdigital_com/_layouts/15/Doc.aspx?sourcedoc={aaa70865-473d-45d9-a2f4-213233789316}&action=edit&wdStartOn=1&amp;action=embedview&output=embed" width="476px" height="288px" frameborder="0">This is an embedded <a target="_blank" href="https://office.com">Microsoft Office</a> document, powered by <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>        </div>
    );
};

export default WordIframe;
