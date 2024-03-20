import { cn } from "@/lib/utils";
import Loader from "@components/Loader";
import {
  Button,
  Card,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Button2 from "@components/ui/button"
import { deleteApi } from "/services/services";
import { CheckCircle, ChevronLeftIcon, ChevronRightIcon, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ImageMediaClient from "./ImageMediaClient";
import UploadMediaClient from "./UploadMediaClient";
import ImageName from "./ImageName";
import { IoIosSearch } from "react-icons/io";
import { Input } from "@components/ui/input";
import { toast } from "sonner";

const MediaClient = ({
  clientImages,
  galleryImages,
  setGalleryImages,
  setUpdateUI,
  setClientImages,
  setSearchImg,
  form,
  page,
  setPage,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const originalImagesRef = useRef(galleryImages);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSelectionChanged, setIsSelectionChanged] = useState(false);

  // בדיקה אם יש שינויים בין הבחירה הנוכחית למקורית
  const hasSelectionChanged = () => {
    const currentIds = new Set(selectedImages.map((img) => img.id));
    const originalIds = new Set(originalImagesRef.current.map((img) => img.id));
    const hasChanged =
      selectedImages.some((img) => !originalIds.has(img.id)) ||
      originalImagesRef.current.some((img) => !currentIds.has(img.id));
    return hasChanged;
  };

  useEffect(() => {
    setIsSelectionChanged(hasSelectionChanged());
  }, [selectedImages, originalImagesRef.current]);

  useEffect(() => {
    originalImagesRef.current = galleryImages;
  }, [galleryImages]);

  const updateGallery = () => {
    // תמונות חדשות להוספה
    const newImages = selectedImages.filter(
      (selectedImage) =>
        !galleryImages.some((image) => image.id === selectedImage.id)
    );

    // תמונות קיימות שיש לשמור
    const keptImages = galleryImages.filter((originalImage) =>
      selectedImages.some((image) => image.id === originalImage.id)
    );

    // עדכון המערך המקורי עם התמונות החדשות והתמונות שנשמרות
    setGalleryImages([...keptImages, ...newImages]);
    setUpdateUI((prev) => !prev);
    setSelectedImages([]);
  };

  const openModal = () => {
    // אתחול עם התמונות שכבר נמצאות בגלריה
    setSelectedImages(galleryImages);
    onOpen();
  };

  const deleteImage = (id, event) => {
    // event.stopPropagation();
    const wordpressApiEndpoint = `${window.siteUrl}/wp-json/wp/v2/media/${id}/`;

    if (window.confirm("Are you sure you want to delete this image?")) {
      deleteApi(wordpressApiEndpoint)
        .then((response) => {
          toast(
            <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
              <CheckCircle className="w-5 h-5 text-green-500" />
              The image has been deleted successfully
            </div>,
            { duration: 5000 }
          );
          setClientImages((prevImages) =>
            prevImages.filter((image) => image.id !== id)
          );
        })
        .catch((error) => {
          console.error(
            "Error deleting the image:",
            error.message || error.response?.data.message || "Unknown error"
          );
        });
    }
  };
  return (
    <>
      <Card
        isPressable
        radius="md"
        className="border-2 border-dashed border-slate-300 dark:border-slate-500 hover:border-primary max-h-fit shadow-none !ring-0 !outline-offset-0 !ring-offset-0"
        onPress={openModal}
      >
        <div
          className={cn(
            form ? "!h-[184px] !w-full" : "w-[223px] !h-[223px]",
            "overflow-hidden text-gray-400 hover:text-primary bg-white dark:bg-slate-700 hover:animate-pulse flex flex-col justify-center items-center p-2 rounded-xl"
          )}
        >
          <div className="">
            <Plus className={cn(form ? "w-20 h-20" : "w-32 h-32")} />
          </div>
          <p className={cn(form ? "text-xl" : "text-3xl")}>Add images</p>
        </div>
      </Card>
      <Modal
        size="5xl"
        backdrop="opaque"
        placement="top-center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
              <ModalHeader className="flex flex-col gap-1 text-center text-3xl text-gray-400">
                Select Photos from your gallery or upload new
              </ModalHeader>
              <ModalBody className="">
                <div className="flex w-full flex-col items-center">
                  <div className="!h-[500px] w-full overflow-y-scroll scrollbar-default">
                    <UploadMediaClient
                      setClientImages={setClientImages}
                      setSelectedImages={setSelectedImages}
                    />
                    <div className="w-full h-14 flex justify-center items-start gap-2">
                      <div className="relative h-10 w-60 border rounded-lg flex gap-1 items-center px-1 dark:bg-slate-700">
                        <IoIosSearch className="w-6 h-6 text-gray-500" />
                        <Input
                          placeholder="Search image..."
                          type="search"
                          onChange={(event) => setSearchImg(event.target.value)}
                          className="!border-none !ring-0 placeholder:text-slate-400 dark:!text-slate-300 placeholder:dark:text-slate-300/90 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center ">
                      {clientImages.length > 0 ? (
                        clientImages.map((image, index) => (
                          <Card
                            key={index}
                            isFooterBlurred
                            radius="md"
                            className="border-none max-h-fit cursor-pointer"
                          >
                            <CardHeader className="absolute z-10 top-0 flex-col !items-end">
                              <Button
                                className="text-tiny text-primary bg-white/50"
                                variant="flat"
                                color="default"
                                radius="sm"
                                size="sm"
                                isIconOnly
                                onClick={() => deleteImage(image.id)}
                              >
                                <Trash2 className="w-4" />
                              </Button>
                            </CardHeader>
                            <ImageMediaClient
                              image={image}
                              selectedImages={selectedImages}
                              setSelectedImages={setSelectedImages}
                              clientImages={clientImages}
                              galleryClient={galleryImages}
                            />
                            <ImageName image={image} />
                          </Card>
                        ))
                      ) : (
                        <Loader />
                      )}
                    </div>
                    <div className="w-full h-10 flex justify-center items-center gap-4 mt-4">
                      <Button2
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage((prev) => prev - 1)}
                        disabled={page <= 1}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button2>
                      <p className="dark:text-slate-300">page {page}</p>
                      <Button2
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={clientImages.length < 100}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button2>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="text-white"
                  isDisabled={!isSelectionChanged}
                  onClick={() => {
                    if (hasSelectionChanged()) {
                      updateGallery();
                    }
                  }}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MediaClient;
