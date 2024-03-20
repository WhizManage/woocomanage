import { cn } from "@/lib/utils";
import Loader from "@components/Loader";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Check,
  CheckCircle,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImagePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import UploadMediaClient from "../gallery/UploadMediaClient";
import { deleteApi, getApi } from "/services/services";
import { Input } from "@components/ui/input";
import { IoIosSearch } from "react-icons/io";
import ImageName from "../gallery/ImageName";
import { toast } from "sonner";
import Button2 from "@components/ui/button";

const ImageEdit = ({ row, setImage }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [clientImages, setClientImages] = useState([]);
  const [searchImg, setSearchImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    row ? (row.depth == 0 ? row?.original?.images[0] : row?.original?.image) : {}
  );
  useEffect(() => {
    setLoading(true);
    const wordpressApiEndpoint = `${window.siteUrl}/wp-json/wp/v2/media?search=${searchImg}&per_page=100&page=${page}`;
    getApi(wordpressApiEndpoint)
      .then((response) => {
        const fetchedImages = response.data.map((image) => ({
          id: image.id,
          src: image.source_url,
          name: image.title.rendered,
        }));
        setClientImages(fetchedImages);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images from WordPress API:", error);
        setLoading(false);
      });
  }, [searchImg, page]);

  const deleteImage = (id, event) => {
    event.stopPropagation();
    const wordpressApiEndpoint = `${window.siteUrl}/wp-json/wp/v2/media/${id}/`;

    if (window.confirm("Are you sure you want to delete this image?")) {
      deleteApi(wordpressApiEndpoint)
        .then((response) => {
          toast(
            <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:!bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
              <CheckCircle className="w-5 h-5 text-green-500" />
              The image hes been downloaded successfully
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

  const handleClicked = (image) => {
    if (selectedImage?.src == image.src) setSelectedImage({});
    else setSelectedImage(image);
  };

  const handleSave = () => {
    if (row) {
      row.depth == 0
        ? (row.original.images[0] = selectedImage)
        : (row.original.image = selectedImage);
    } else if (selectedImage && selectedImage.src) {
      setImage(selectedImage);
    }
  };
  return (
    <>
      {row ? (
        <Tooltip
          className="p-0 m-0"
          placement={window.user_local == "he_IL" ? "left" : "right"}
          content={
            <Image
              width={300}
              alt="NextUI hero Image"
              src={
                row.depth == 0 
                  ? row?.original?.images[0]?.src ||
                    "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
                  : row?.original?.image?.src ||
                    "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
              }
            />
          }
        >
          <Avatar
            src={selectedImage?.src}
            radius="sm"
            isBordered
            className="cursor-pointer dark:!bg-slate-700 dark:!border-slate-700"
            isPressable
            onClick={onOpen}
            fallback={
              <img
                className="w-full h-full object-fill"
                src="https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg"
              />
            }
          />
        </Tooltip>
      ) : (
        <div
          className="relative overflow-hidden h-[260px] border-2 border-dashed border-slate-300 dark:border-slate-500 hover:border-primary rounded-lg flex flex-col gap-1 items-center justify-center cursor-pointer text-gray-400 hover:text-primary bg-white dark:bg-slate-700 hover:animate-pulse"
          onClick={onOpen}
        >
          {selectedImage.src ? (
            <img
              alt="product image"
              src={selectedImage.src}
              className="object-cover w-full h-full"
            />
          ) : (
            <>
              <ImagePlus className="w-24 h-24" />
              <p className="text-center text-xl">Add image</p>
            </>
          )}
        </div>
      )}
      <Modal
        size="3xl"
        backdrop="opaque"
        placement="top-center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent className="dark:bg-slate-800">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center text-3xl text-gray-400">
                Select Image
              </ModalHeader>
              <ModalBody className="">
                <div className="flex w-full flex-col items-center">
                  <div className="!h-[500px] overflow-y-scroll">
                    <UploadMediaClient
                      setClientImages={setClientImages}
                      setSelectedImage={setSelectedImage}
                    />
                    <div className="w-full h-20 flex justify-center items-center gap-2">
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
                    <div className="flex flex-wrap gap-4 justify-center pb-4">
                      {loading ? (
                        <Loader />
                      ) : clientImages.length > 0 ? (
                        clientImages.map((image, index) => (
                          <Card
                            key={index}
                            isFooterBlurred
                            radius="md"
                            className={cn(
                              "max-h-fit dark:bg-slate-700",
                              selectedImage?.src == image?.src &&
                                "shadow shadow-primary"
                            )}
                          >
                            <CardHeader className="absolute z-10 top-0 flex-col !items-end">
                              <Button
                                className="text-tiny text-primary bg-white/50 hover:!bg-white/70"
                                variant="flat"
                                color="default"
                                radius="sm"
                                size="sm"
                                isIconOnly
                                onClick={(event) =>
                                  deleteImage(image.id, event)
                                }
                              >
                                <Trash2 className="w-4" />
                              </Button>
                            </CardHeader>
                            <div
                              className={cn(
                                selectedImage?.src == image?.src &&
                                  "border-1 border-b-0 border-primary",
                                "!w-[223px] !h-[223px] overflow-hidden image-container rounded-xl"
                              )}
                              onClick={() => handleClicked(image)}
                            >
                              <Image
                                alt="Woman listing to music"
                                className="object-contain z-0 rounded-xl"
                                src={image.src}
                                isPressable
                              />
                              {selectedImage?.src == image?.src && (
                                <CardBody className="absolute z-10 top-0 h-full flex-col !items-center justify-center bg-black/30">
                                  <Check className="w-20 h-20 text-primary" />
                                </CardBody>
                              )}
                            </div>
                            <ImageName image={image} />
                          </Card>
                        ))
                      ) : (
                        <div className="flex items-center text-xl w-full justify-center p-0 h-14 bg-transparent text-slate-300">
                          No images
                        </div>
                      )}
                    </div>
                    <div className="w-full h-10 flex justify-center items-center gap-4">
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
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleSave();
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

export default ImageEdit;
