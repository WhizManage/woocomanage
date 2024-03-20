import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { Download } from "lucide-react";
import { useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import * as XLSX from "xlsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { CustomRadio } from "./nextUI/CustomRadio";
import { Label } from "./ui/label";
export default function ExportToExcel({
  selectedRows,
  setSelectedRows,
  ColumnsVisible,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState(null);
  const updateExport = () => {
    if (selectedOption === "all") {
      const allColumnsData = selectedRows.map(({ original }) => ({
        ...original,
        categories: original.categories
          ? original.categories.map((category) => category.name).join(", ")
          : "",
        tags: original.tags
          ? original.tags.map((tag) => tag.name).join(", ")
          : "",
      }));
      exportToExcel(allColumnsData);
    } else if (selectedOption === "table") {
      const updateSelectRow = selectedRows.map(({ original }) => {
        const newRow = ColumnsVisible.reduce((acc, { id }) => {
          acc[id] = original[id];
          return acc;
        }, {});
        if ("categories" in newRow) {
          newRow.categories = original.categories
            ? original.categories.map((category) => category.name).join(", ")
            : "";
        }

        if ("tags" in newRow) {
          newRow.tags = original.tags
            ? original.tags.map((tag) => tag.name).join(", ")
            : "";
        }
        return newRow;
      });

      exportToExcel(updateSelectRow);
    }
  };
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const fileName = "product table.xlsx";
    saveAs(blob, fileName);
  };

  const saveAs = (blob, fileName) => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleAgree = () => {
    updateExport();
    setSelectedRows({});
  };

  return (
    <>
      <div
        className="flex flex-col w-full items-center justify-center gap-2 p-2 hover:bg-fuchsia-50 dark:hover:bg-slate-800 hover:cursor-pointer"
        onClick={onOpen}
      >
        <Download />
        <p>Export</p>
      </div>
      <Modal
        size="xl"
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="">
                <Alert variant="warning" className="mt-6">
                  <AiOutlineWarning className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Please be aware that updating products by importing a
                    modified Excel file may lead to unexpected issues. Use this
                    feature with caution as the system cannot be held
                    responsible for any resulting problems.
                  </AlertDescription>
                </Alert>
                <div className="w-full mt-4 space-y-2">
                  <Label>Columns to export:</Label>
                  <RadioGroup
                    defaultValue="no"
                    onValueChange={(value) => {
                      setSelectedOption(value);
                    }}
                  >
                    <CustomRadio value="all">All columns</CustomRadio>
                    <CustomRadio value="table">The table columns</CustomRadio>
                  </RadioGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="bordered" onPress={onClose}>
                  Disagree
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  className="text-white"
                  isDisabled={selectedOption === null}
                  onClick={() => {
                    handleAgree();
                    onClose();
                  }}
                >
                  Continue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
