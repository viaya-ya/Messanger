import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./MyEditor.css";
import { usePostImageMutation } from "../../BLL/policyApi";

export default function MyEditor({
  editorState,
  setEditorState,
  userId,
  policyId,
  policyContent,
}) {
  const [postImage] = usePostImageMutation();

  // Функция для обработки загрузки изображений
  const uploadImageCallback = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Вызов postImage для отправки файла на сервер
      const response = await postImage({
        userId,
        policyId,
        formData,
      }).unwrap();

      // Проверка формата ответа
      const filePath = (response.filePath || response.data?.filePath)?.replace(/\\/g,"/");

      if (!filePath) {
        throw new Error("filePath не найден в ответе сервера");
      }

      console.log("Успешно загружено:", filePath);

      return {
        data: {
          link: `http://localhost:5000/${filePath}`,
        },
      };
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div>
      {policyContent ? (
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
              uploadCallback: uploadImageCallback, // Обработчик загрузки
              alt: { present: true, mandatory: false },
              previewImage: true,
            },
          }}
        />
      ) : (
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          toolbarHidden={true}
        />
      )}
    </div>
  );
}
