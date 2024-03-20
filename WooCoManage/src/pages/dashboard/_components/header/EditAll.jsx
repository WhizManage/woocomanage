import { cn } from "@/lib/utils";
import Button from "@components/ui/button";
import axios from "axios";
import { CheckCircle, SaveAll, XCircle } from "lucide-react";
import React, { useState } from "react";
import { MdCancel, MdOutlineEditNote } from "react-icons/md";
import { toast } from "sonner";

const EditAll = ({
  table,
  editAll,
  setEditAll,
  data,
  setData,
  setEditingRows,
  editedItems,
  setEditedItems,
}) => {
  const [originalData, setOriginalData] = useState([]);

  React.useEffect(() => {
    if (
      data &&
      data.length > 0 &&
      (!originalData || originalData.length === 0)
    ) {
      setOriginalData([...data]);
    }
  }, [data]);

  const sendBatchUpdate = (items) => {
    const WooCommerceEndpoint = `${window.siteUrl}/wp-json/wc/v3/`;
    axios
      .post(
        WooCommerceEndpoint + "products/batch",
        { update: items },
        { headers: { "X-WP-Nonce": window.rest } }
      )
      .then(() => {
        toast(
          <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-400 !border-l-4 !border-l-green-500 rounded-md flex gap-4 items-center justify-start">
            <CheckCircle className="w-5 h-5 text-green-500" />
            The updates have been saved successfully.
          </div>,
          { duration: 5000 }
        );
      })
      .catch((error) => {
        setData(originalData);
        toast(
          <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-300 !border-l-4 !border-l-red-500 rounded-md flex gap-4 items-center justify-start">
            <XCircle className="w-5 h-5 text-red-500" />
            {error.response.data.message}
          </div>,
          { duration: 5000 }
        );
      });
  };
  const sendVariationBatchUpdate = (id, variations) => {
    const WooCommerceEndpoint = `${window.siteUrl}/wp-json/wc/v3/`;
    axios
      .post(
        WooCommerceEndpoint + `products/${id}/variations/batch`,
        { update: variations },
        { headers: { "X-WP-Nonce": window.rest } }
      )
      .catch((error) => {
        setData(originalData);
        toast(
          <div className="p-4 dark:bg-slate-800 w-full h-full dark:text-slate-300 !border-l-4 !border-l-red-500 rounded-md flex gap-4 items-center justify-start">
            <XCircle className="w-5 h-5 text-red-500" />
            {error.response.data.message}
          </div>,
          { duration: 5000 }
        );
      });
  };

  const saveAllEdits = () => {
    const itemsToSave = data.filter((item) => editedItems.includes(item.id));
    const subItemsToSave = data.reduce((acc, item) => {
      // בדיקה אם יש תת-מוצרים ואם יש בהם כאלו שנערכו
      const editedSubRows =
        item.subRows?.filter((subItem) => editedItems.includes(subItem.id)) ||
        [];
      if (editedSubRows.length > 0) {
        acc.push({ [item.id]: editedSubRows });
      }
      return acc;
    }, []);


    if (itemsToSave.length > 100) {
      for (let i = 0; i < itemsToSave.length; i += 100) {
        const chunk = itemsToSave.slice(i, i + 100);
        sendBatchUpdate(chunk);
      }
    } else {
      sendBatchUpdate(itemsToSave);
    }

    subItemsToSave.forEach(element => {
      const parentId = Object.keys(element)[0]; 
      const variations = element[parentId];
      sendVariationBatchUpdate(parentId, variations);
    });
    
    setEditingRows(new Set());
    setEditAll(false);
    setEditedItems([]);
  };

  return (
    <>
      {editAll && (
        <Button
          variant="outline"
          className="ring-primary ring-1 ring-offset-1 ring-offset-white dark:!ring-offset-slate-700 !bg-fuchsia-50/50 dark:!bg-slate-900/70 px-2 sm:px-4 flex gap-2"
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel all edits?")) {
              setData(originalData);
              setEditAll((editAll) => !editAll);
              setEditingRows(new Set());
            }
          }}
        >
          <MdCancel className="h-5 w-5" />
          Cancel
        </Button>
      )}
      <Button
        variant="outline"
        className={cn(
          editAll
            ? "ring-primary ring-1 ring-offset-1 ring-offset-white dark:!ring-offset-slate-700 !bg-fuchsia-50/50 dark:!bg-slate-900/70"
            : "",
          "px-2 sm:px-4 flex rtl:flex-row-reverse"
        )}
        onClick={(event) => {
          const toggleAll = table.getToggleAllRowsExpandedHandler();
          ! table.getIsAllRowsExpanded() && toggleAll(event);
          editAll ? saveAllEdits() : setEditAll((editAll) => !editAll);
        }}
      >
        {editAll ? (
          <SaveAll className="mr-2 h-4 w-4" />
        ) : (
          <MdOutlineEditNote className="mr-2 h-5 w-5" />
        )}
        {editAll ? "Save" : "Edit All"}
      </Button>
    </>
  );
};

export default EditAll;
