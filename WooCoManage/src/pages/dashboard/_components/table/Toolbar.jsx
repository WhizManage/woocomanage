import { postApi } from "/services/services";
import ExportToExcel from "@components/exportToExcel";
import axios from "axios";
import { CopyPlus, ScanEye, Settings2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Toolbar = ({ setRowSelection, table, fetchData, isTrash }) => {
  const [singleRowToastId, setSingleRowToastId] = useState(null);
  const [severalRowToastId, setSeveralRowToastId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const WooCommerceEndpoint = `${window.siteUrl}/wp-json/wc/v3/`;
  const deleteProducts = () => {
    const { productsToDelete, subProductsToDelete } = selectedRows.reduce(
      (acc, product) => {
        if (product.depth == 0) {
          acc.productsToDelete.push(product);
        } else {
          acc.subProductsToDelete.push(product);
        }
        return acc;
      },
      { productsToDelete: [], subProductsToDelete: [] }
    );


    productsToDelete.map((product) => {
      product.original.status = "trash";
    });
    if (
      window.confirm(
        isTrash
          ? "Are you sure you want to permanently delete the selected products? This action cannot be undone."
          : "Are you sure you want to move the selected products to the trash? Any selected variations will be permanently deleted. This action cannot be undone."
      )
    ) {
      setLoading(true);
      axios
        .post(
          WooCommerceEndpoint + "products/batch",
          isTrash
            ? {
                delete: productsToDelete.map((product) => product.original.id),
              }
            : {
                update: productsToDelete.map((product) => ({
                  id: product.original.id,
                  status: "trash",
                })),
              },
          {
            headers: {
              "X-WP-Nonce": window.rest,
            },
          }
        )
        .then((response) => {
          fetchData();
          setRowSelection({});
          setLoading(false);
        })
        .catch((error) => {
          console.log(error.response.data);
          setLoading(false);
        });
      subProductsToDelete.map((product) => {
        axios.delete(
          WooCommerceEndpoint +
            `products/${product.original.parent_id}/variations/${product.original.id}`,
          {
            headers: { "X-WP-Nonce": window.rest },
            params: { force: true },
          }
        );
      });
    }
  };
  const duplicateProducts = () => {
    const product = selectedRows[0].original;
    product.id = null;
    product.name = product.name + " (copy)";
    product.status = "draft";
    product.sku = null;
    setRowSelection({});
    postDuplicateProduct(product);
  };
  const postDuplicateProduct = async (newData) => {
    setLoading(true);
    await postApi(WooCommerceEndpoint + "products", newData)
      .then((response) => {
        setLoading(false);
        fetchData();
      })
      .catch((error) => {
        console.log(error.response.data);
        setLoading(false);
      });
  };
  const getSelectedRows = (rows) => {
    let selectedRows = [];
    const traverseRows = (rows) => {
      rows.forEach((row) => {
        if (row.getIsSelected()) {
          selectedRows.push(row);
        }
      });
    };
    traverseRows(rows);
    return selectedRows;
  };

  useEffect(() => {
    const newSelectedRows = getSelectedRows(table.getRowModel().rows);
    setSelectedRows(newSelectedRows);
  }, [table.getGroupedSelectedRowModel().rows]);

  useEffect(() => {
    const selectedRowCount = selectedRows.length;
    if (selectedRowCount === 1) {
      // Dismiss the several row toast if it's displayed
      if (severalRowToastId) {
        toast.dismiss(severalRowToastId);
        setSeveralRowToastId(null);
      }

      // Show the single row toast
      if (!singleRowToastId) {
        const id = toast(
          <div className="text-primary dark:text-fuchsia-500 flex gap-2 items-center justify-between w-full dark:bg-slate-900 rounded-lg">
            <div
              className="flex flex-col w-full items-center justify-center gap-2 p-2 hover:bg-fuchsia-50 dark:hover:bg-slate-800 hover:cursor-pointer"
              onClick={deleteProducts}
            >
              <Trash2 />
              <p>Delete</p>
            </div>
            <div
              className="flex flex-col w-full items-center justify-center gap-2 p-2 hover:bg-fuchsia-50 dark:hover:bg-slate-800 hover:cursor-pointer"
              onClick={duplicateProducts}
            >
              <CopyPlus />
              <p>Duplicate</p>
            </div>
            {selectedRows[0] && (
              <a
                href={selectedRows[0].original.permalink}
                target="_blank"
                className="flex flex-col w-full items-center justify-center gap-2 p-2 hover:bg-fuchsia-50 dark:hover:bg-slate-800 hover:cursor-pointer hover:!text-fuchsia-700"
              >
                <ScanEye />
                <p>View</p>
              </a>
            )}
          </div>,
          { duration: 500000, position: "bottom-center" }
        );
        setSingleRowToastId(id);
      }
    } else if (selectedRowCount > 1) {
      // Dismiss the single row toast if it's displayed
      if (singleRowToastId) {
        toast.dismiss(singleRowToastId);
        setSingleRowToastId(null);
      }

      // Show the several row toast
      if (!severalRowToastId) {
        const id = toast(
          <div className="text-primary dark:text-fuchsia-500 flex gap-2 items-center justify-between w-full dark:bg-slate-900 rounded-lg">
            <div
              className="flex flex-col w-full items-center justify-center gap-2 p-2 hover:bg-fuchsia-50 dark:hover:bg-slate-800 hover:cursor-pointer"
              onClick={deleteProducts}
            >
              <Trash2 />
              <p>Delete</p>
            </div>
            {/* <div
              className="flex flex-col w-full items-center justify-center gap-2 p-2 hover:bg-fuchsia-50 dark:hover:bg-slate-800 hover:cursor-pointer"
              // onClick={deleteProducts}
            >
              <Settings2 />
              <p>Bulk edit</p>
            </div> */}
            <ExportToExcel
              selectedRows={[...selectedRows]}
              setSelectedRows={setRowSelection}
              ColumnsVisible={table
                .getAllColumns()
                .filter((column) => column.getCanHide())}
            />
          </div>,
          { duration: 500000, position: "bottom-center" }
        );
        setSeveralRowToastId(id);
      }
    } else {
      // Dismiss any toast if no or more than two rows are selected
      if (singleRowToastId) {
        toast.dismiss(singleRowToastId);
        setSingleRowToastId(null);
      }
      if (severalRowToastId) {
        toast.dismiss(severalRowToastId);
        setSeveralRowToastId(null);
      }
    }
  }, [selectedRows]);
  return <div className="hidden"></div>;
};

export default Toolbar;
