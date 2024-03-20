import { IconBadge } from "@components/IconBadge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { LayoutList } from "lucide-react";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  TextColor,
  handleUploadPhotoEditor,
  inlineOptions,
  listOptions,
  newOptions,
} from "../../table/edit/editor/toolsEditor";

const DescriptionGroup = ({ register, updateValue, errors }) => {
  const renderEditor = (title, name) => {
    const [editorState, setEditorState] = useState(() =>
      EditorState.createEmpty()
    );
    const onEditorStateChange = (newEditorState) => {
      setEditorState(newEditorState);
      updateValue(
        title,
        draftToHtml(convertToRaw(newEditorState.getCurrentContent()))
      );
    };
    return (
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="email">Product {name}</Label>
        <div className="relative h-fit border rounded-lg flex gap-1 items-center dark:bg-slate-700">
          <Editor
            editorState={editorState}
            wrapperClassName="demo-editor"
            editorClassName="demo-editor px-2"
            onEditorStateChange={onEditorStateChange}
            placeholder={`Type a ${name} here.`}
            toolbar={{
              options: newOptions,
              inline: { options: inlineOptions },
              list: { options: listOptions },
              textAlign: { inDropdown: true },
              colorPicker: { colors: TextColor },
              image: {
                uploadCallback: handleUploadPhotoEditor,
                previewImage: true,
              },
            }}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={LayoutList} />
        <h2 className="text-xl dark:text-gray-400">Describe your product</h2>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="name">Product Name *</Label>
        <div className="relative h-10 border rounded-lg flex gap-1 items-center px-1 dark:bg-slate-700">
          <Input
            type="text"
            id="name"
            placeholder="Name"
            className="!border-none dark:!text-slate-300 !ring-0 placeholder:text-slate-400 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
            {...register("name", { required: "Product name is required" })}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 dark:text-pink-500 text-sm px-2">{errors.name.message}</p>
        )}
      </div>
      {renderEditor("description", "Description")}
      {renderEditor("short_description", "Short description")}
    </div>
  );
};

export default DescriptionGroup;
