import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

const UploadMediaClient = ({setClientImages,setSelectedImages,setSelectedImage }) => {
    const [loading, setLoading] = useState(false);
    const onDrop = async (acceptedFiles) => {
        if (loading) return;
        setLoading(true);
    
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("file", file);
          fetch(window.siteUrl+"/wp-json/wp/v2/media", {
            method: "POST",
            headers: {
              "X-WP-Nonce": window.rest,
            },
            body: formData,
          })
          .then(response => response.json())
            .then((response) =>
            {
            const newClientImage = {
              id: response.id,
              src: response.source_url,
              name: response?.title?.rendered || response?.title,
            };
            setClientImages && setClientImages((prevImages) => [newClientImage, ...prevImages]);
            setSelectedImages && setSelectedImages((prevImages) => [newClientImage, ...prevImages]);
            setSelectedImage && setSelectedImage(newClientImage)
            toast(
              <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  The image hes been downloaded successfully                 
                </div>,
              { duration: 5000 }
            )})
            .catch((error) => {
              console.error("Error uploading media:", error);
            })
            .finally(() => {
              setLoading(false);
            });
        });
      };
    
      const maxsize = 3000000000;
  return (
    <div className="w-full mb-2 p-2">
      <Dropzone minSize={0} maxSize={maxsize} onDrop={onDrop}>
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          fileRejections,
        }) => {
          const isFileTooLarge =
            fileRejections.length > 0 && fileRejections[0].file.size > maxsize;
          return (
            <section className="">
              <div
                {...getRootProps()}
                className={cn(
                  "w-full h-24 flex justify-center items-center border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg text-center cursor-pointer dark:hover:bg-gray-700 hover:border-primary transition-all",
                  isDragActive
                    ? "bg-primary text-white animate-pulse"
                    : "dark:bg-gray-800/80 text-slate-400 font-semibold hover:text-primary hover:animate-pulse"
                )}
              >
                <input {...getInputProps()} multiple />
                {!isDragActive && (
                  <p className="text-xl">
                    Drag and drop some photos here, or click to select photos
                  </p>
                )}
                {isDragActive && !isDragReject && (
                  <p className="text-xl">Drop to upload this photo!</p>
                )}
                {isDragReject && (
                  <p className="text-xl">Photo type not accepted, sorry!</p>
                )}
                {isFileTooLarge && (
                  <p className="text-xl">Photo is too large</p>
                )}
              </div>
            </section>
          );
        }}
      </Dropzone>
    </div>
  );
};

export default UploadMediaClient;
