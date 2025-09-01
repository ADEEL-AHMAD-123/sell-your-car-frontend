import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import MainLoader from './Spinner';

const MemoizedEditor = React.memo(({ initialValue, onInit }) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  return (
    <div className="editor-container">
      {!isEditorReady && (
        <div className="editor-loader">
          <MainLoader />
        </div>
      )}
      <Editor
        apiKey='l6f3fdlflomcknz3v6lz0yyjuefcnmuclverywux19f54brl'
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setIsEditorReady(true);
          if (onInit) {
            onInit(editor);
          }
        }}
        initialValue={initialValue}
        init={{
          height: 500,
          menubar: false,
          skin: 'oxide-dark',
          content_css: 'dark',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
            'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | fullscreen code',
          branding: false,
          resize: false,
          statusbar: false,
        }}
      />
    </div>
  );
});

export default MemoizedEditor;