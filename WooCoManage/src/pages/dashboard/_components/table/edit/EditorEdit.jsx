import { Button } from "@components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { TextColor, handleUploadPhotoEditor, inlineOptions, listOptions, newOptions } from "./editor/toolsEditor";

const showNormalTextForTitle = (textHtml) => {
  const parser = new DOMParser();
  const htmlString = textHtml.toString();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent;
};

const EditorEdit = ({ row,title}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onSave = () => {
    row[title] = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    
  };
 
  const [editorState, setEditorState] =useState(() => {
      const contentBlock = htmlToDraft(row[title]);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        return EditorState.createWithContent(contentState);
      }
      return EditorState.createEmpty();
    });
  const onEditorStateChangeShortDescription = (newEditorState) => {
    setEditorState(newEditorState);
  };
  return (
    <>
      <Button
        onClick={onOpen}
        variant="outline"
        className="flex gap-2 h-8 capitalize"
        title={showNormalTextForTitle(row[title]) }
      >
        Edit
        <Edit className="ml-2 rtl:mr-2 rtl:ml-0 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <Modal
        size="2xl"
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent className="dark:bg-slate-800">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-3xl">
                Edit {title}
              </ModalHeader>
              <ModalBody>
              <div className="relative h-fit border dark:border-slate-700 rounded-lg flex gap-1 items-center dark:bg-slate-800">
                <Editor
                  editorState={editorState}
                  wrapperClassName="demo-editor"
                  editorClassName="demo-editor p-20 overflow-auto"
                  onEditorStateChange={onEditorStateChangeShortDescription}
                  placeholder="Type a short description here."
                  className="dark:!bg-slate-800"
                  toolbar={{
                    options: newOptions,
                    inline:{options:inlineOptions},
                    list:{options: listOptions},
                    textAlign: { inDropdown: true },
                    colorPicker: { colors: TextColor },
                    image: {
                      uploadCallback: handleUploadPhotoEditor,
                      previewImage: true,
                    },
                  }}
                />
              </div>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onSave();
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditorEdit;
