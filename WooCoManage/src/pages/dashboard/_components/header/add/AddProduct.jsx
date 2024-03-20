import { StatusKeys } from "@/data/statusKeys";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Button } from "@components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { CheckCircle, Plus, RefreshCcw } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { toast } from "sonner";
import DescriptionGroup from "./DescriptionGroup";
import InventoryGroup from "./InventoryGroup";
import LabelsGroup from "./LabelsGroup";
import PhotosGroup from "./PhotosGroup";
import PricesGroup from "./PricesGroup";
import { postApi } from "/services/services";
const AddProduct = ({ fetchData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formStates, setFormStates] = useState({});
  const [status, setStatus] = useState("publish");
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const onSubmit = async (data, onClose) => {
    const combinedData = { ...data, ...formStates };
    try {
      setIsLoading(true);
      await postApi(`${window.siteUrl}/wp-json/wc/v3/products`, combinedData);
      toast(
        <div className="p-4 w-full h-full !border-l-4 !border-l-green-500 dark:bg-slate-800 dark:text-slate-300 rounded-md flex gap-4 items-center justify-start">
          <CheckCircle className="w-5 h-5 text-green-500" />A new product added
        </div>,
        { duration: 5000 }
      );
      fetchData();
      reset();
      setErrorMessage("");
      setFormStates([]);
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(
        error?.response?.data?.message || "Failed to add product"
      );
      console.log(error);
    }
  };

  const updateValue = (keyName, value) => {
    setFormStates({ ...formStates, [keyName]: value });
  };
  const isFormInvalid = Object.keys(errors).length > 0;

  return (
    <>
      <Button className="flex gap-2" onClick={onOpen}>
        <Plus className="h-4 w-4" />
        Add product
      </Button>
      <Modal
        size="5xl"
        scrollBehavior="inside"
        backdrop="opaque"
        className="!scrollbar-hide scrollbar-none"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-800 to-zinc-800/30 backdrop-opacity-20 !scrollbar-hide scrollbar-none",
        }}
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
      >
        <ModalContent className="dark:bg-gray-900">
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-1 text-center text-3xl justify-center">
                <h2 className="text-center dark:text-gray-400">
                  Add new product
                </h2>
              </ModalHeader>
              <ModalBody>
                <ScrollShadow size={10} className="w-full h-full">
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="flex flex-col gap-6 overflow-auto py-6">
                      <DescriptionGroup
                        register={register}
                        updateValue={updateValue}
                        errors={errors}
                      />
                      <InventoryGroup
                        register={register}
                        updateValue={updateValue}
                      />
                    </div>
                    <div className="flex flex-col gap-6 overflow-scroll py-6">
                      <PricesGroup register={register} errors={errors} />
                      <LabelsGroup updateValue={updateValue} />
                      <PhotosGroup updateValue={updateValue} />
                    </div>
                  </form>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                {errorMessage !== "" && (
                  <Alert
                    variant="primary"
                    className="flex items-center max-w-fit !h-10"
                  >
                    <AlertDescription className="flex gap-4 justify-center items-center">
                      <MdError className="h-4 w-4" />
                      <p className="dark:!text-white">{errorMessage}</p>
                    </AlertDescription>
                  </Alert>
                )}
                <select
                  name=""
                  id=""
                  className={cn(
                    "capitalize font-semibold px-4 border rounded-md text-sm w-fit rtl:mr-2 py-0 h-10 focus-visible:ring-0 focus:ring-offset-0",
                    StatusKeys[status]
                  )}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    updateValue("status", e.target.value);
                  }}
                >
                  {Object.keys(StatusKeys).map((statusItem) => (
                    <option
                      value={statusItem}
                      className={cn(
                        "capitalize cursor-pointer font-semibold text-sm w-full !py-4 hover:border-slate-500",
                        StatusKeys[statusItem]
                      )}
                    >
                      {statusItem}
                    </option>
                  ))}
                </select>
                <Button
                  disabled={isFormInvalid || isLoading}
                  color="primary"
                  onClick={() =>
                    handleSubmit((data) => onSubmit(data, onClose))()
                  }
                  className="flex gap-2"
                >
                  Save
                  {isLoading && (
                    <RefreshCcw className="text-white w-5 h-5 animate-spin" />
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProduct;
