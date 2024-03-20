import { IconBadge } from "@components/IconBadge";
import { Label } from "@components/ui/label";
import { Image, X } from "lucide-react";
import { useEffect, useState } from "react";
import ImageEdit from "../../table/edit/Image/ImageEdit";
import MediaClient from "../../table/edit/gallery/MediaClient";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { getApi } from "/services/services";

const PhotosGroup = ({ updateValue }) => {
  const [image, setImage] = useState({});
  const [clientImages, setClientImages] = useState([]);
  const [searchImg, setSearchImg] = useState("");
  const [UpdateUI, setUpdateUI] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  useEffect(() => {
    const wordpressApiEndpoint = `${window.siteUrl}/wp-json/wp/v2/media?search=${searchImg}&per_page=100`;
   getApi(wordpressApiEndpoint)
      .then((response) => {
        const fetchedImages = response.data.map((image) => ({
          id: image.id,
          src: image.source_url,
          name: image.title.rendered,
        }));
        setClientImages(fetchedImages);
      })
      .catch((error) => {
        console.error("Error fetching images from WordPress API:", error);
      });
  }, [searchImg]);
  useEffect(() => {
    const combineImages = [image, ...galleryImages];
    updateValue("images", combineImages);
  }, [image, galleryImages]);

  const removeImageFromGallery = (imageToRemove) => {
    setGalleryImages(galleryImages.filter(image => image.id !== imageToRemove.id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-x-2">
        <IconBadge icon={Image} />
        <h2 className="text-xl dark:text-gray-400">Product image & Gallery</h2>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="email">Product image</Label>
        <ImageEdit
          updateValue={updateValue}
          image={image}
        />
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <Label htmlFor="email">Product gallery</Label>
        <div className="gap-2 grid grid-cols-2 xs:max-md:grid-cols-3 lg:grid-cols-3">
          <MediaClient
            clientImages={clientImages}
            galleryImages={galleryImages}
            setGalleryImages={setGalleryImages}
            setUpdateUI={setUpdateUI}
            setClientImages={setClientImages}
            setSearchImg={setSearchImg}
            form
          />
          {galleryImages.map((item, index) => (
            <Card
              shadow="sm"
              key={index}
              isPressable
            >
              <CardBody className="overflow-visible p-0 relative group">
                <img
                  alt={item.name}
                  className="w-full object-cover h-[140px]"
                  src={item.src}
                />
                <div className="absolute right-0 top-0 w-fit h-fit overflow-visible">
                <div className="w-6 h-6 rounded-full bg-primary text-white hidden group-hover:block" onClick={() => removeImageFromGallery(item)}>
                  <X />
                </div>
                </div>
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b className="truncate !line-clamp-1">{item.name}</b>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotosGroup;
