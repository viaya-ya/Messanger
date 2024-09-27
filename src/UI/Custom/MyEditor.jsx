import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './MyEditor.css';

export default function MyEditor({ editorState, setEditorState }) {
  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        toolbarClassName="demo-toolbar"
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallback, // Добавляем обработчик загрузки
            alt: { present: true, mandatory: false },
            previewImage: true,
          },
        }}
      />
    </div>
  );
}

// Функция для обработки загрузки изображений
const uploadImageCallback = async (file) => {
  // Можете настроить свою логику для загрузки изображений на сервер
  // Ниже пример для эмуляции загрузки с возвратом URL изображения
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ data: { link: reader.result } });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
