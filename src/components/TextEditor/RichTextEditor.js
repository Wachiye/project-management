import React from 'react';
import '../../config/config';

import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css'; // import styles
import 'react-summernote/lang/summernote-es-ES';

import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/dist/css/bootstrap.css';

const RichTextEditor = ({text = "", height, handleChangeFun}) => {
    return (
      <ReactSummernote
        value={text}
        options={{
          height: height || 120,
          dialogsInBody: true,
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link']]
          ]
        }}
        onChange={(value)=>handleChangeFun(value)}
      />
    );
}
 
export default RichTextEditor;