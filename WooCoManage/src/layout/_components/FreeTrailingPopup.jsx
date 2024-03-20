import React, { useEffect } from "react";
import {
  Avatar,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { Filter, Image, Moon } from "lucide-react";
import { MdOutlineEditNote } from "react-icons/md";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import ProBadge from "@components/nextUI/ProBadge";
import Button from "@components/ui/button";
import axios from "axios";

const FreeTrailingPopup = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
 
    checkPro();
  }, []);

  const checkPro = async () => {
    const url = "https://woocomanage.com/wp-json/woocomanage/v1/pro/";
    const msg = "woocomanage_open";
    try {
      const response = await axios.post(url, {
        code: msg
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.data) {
        onOpen();
        window.woocomanagePro=true
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div>
       
      <Modal
        size="5xl"
        scrollBehavior="inside"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
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
              <ModalHeader className="flex flex-col gap-4 text-center text-3xl justify-center items-center">
                <h2 className="text-center dark:text-gray-400">
                  {/* Your pro trail has ended */}
                  The beta period is over
                </h2>
                <a href="https://woocomanage.com/#pricing">
                  <Button variant="outline">Choose your plan</Button>
                </a>
              </ModalHeader>
              <ModalBody className="!pb-8">
                <div
                  className="mockup-browser shadow dark:border dark:border-slate-950 !bg-fuchsia-200 dark:!bg-slate-700"
                  data-theme="light"
                >
                  <div className="mockup-browser-toolbar">
                    <div className="input text-slate-400 !bg-white dark:bg-slate-300 dark:text-slate-500">
                      https://woocomanage.com
                    </div>
                  </div>
                  <div
                    className="flex flex-col justify-center items-center px-7 pb-8 bg-fuchsia-100 dark:bg-slate-800 overflow-hidden"
                    data-theme="light"
                  >
                    <div className="h-20 flex items-center gap-6 overflow-x-scroll scrollbar-hide px-4">
                      <div className="relative">
                        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-3 rotate-[20deg]">
                          <ProBadge />
                        </div>
                        <div className="h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center px-2 gap-2 text-lg text-fuchsia-500 font-semibold">
                          <Filter className="w-4 h-4" />
                          <span>Filters</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-3 rotate-[20deg]">
                          <ProBadge />
                        </div>
                        <div className="h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center px-2 gap-2 text-lg text-fuchsia-500 font-semibold">
                          <EyeNoneIcon className="w-4 h-4" />
                          <span>Columns</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-3 rotate-[20deg]">
                          <ProBadge />
                        </div>
                        <div className="h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center px-2 gap-2 text-lg text-fuchsia-500 font-semibold">
                          <MdOutlineEditNote className="w-5 h-5" />
                          <span className="text-nowrap">Edit All</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-3 rotate-[20deg]">
                          <ProBadge />
                        </div>
                        <div className="h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center px-2 gap-2 text-lg text-fuchsia-500 font-semibold">
                          <Moon className="w-4 h-4" />
                          <span>Themes</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-fit border border-white bg-white dark:border-slate-950 dark:bg-slate-900 rounded-xl divide-y-1">
                      {Array.from({ length: 3 }).map(() => (
                        <div className="h-16 w-full flex gap-4 overflow-hidden px-4">
                          <div className="w-6 h-full flex justify-center items-center">
                            <div className="h-5 w-5 border border-slate-200 animate-pulse dark:border-slate-700 rounded-md"></div>
                          </div>
                          <div className="min-w-16 h-full flex items-center justify-center">
                            <Avatar
                              src=""
                              radius="sm"
                              fallback={
                                <div className="dark:!bg-slate-900 bg-slate-200">
                                  <Image className="h-12 w-12 text-slate-50 dark:!text-slate-800 animate-pulse" />
                                </div>
                              }
                            />
                          </div>
                          <div className="flex items-center justify-center mx-4">
                            <div className="w-64 h-4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                          </div>
                          <div className="flex items-center justify-center mx-4">
                            <div className="w-36 h-4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                          </div>
                          <div className="flex items-center justify-center mx-4">
                            <div className="w-36 h-4 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FreeTrailingPopup;
