import React from "react";
import { DataTable } from "./_components/table/DataTable";
import { columns } from "./_components/table/Columns";
import { getApi } from "/services/services";

function DashboardPage() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTrash, setIsTrash] = React.useState(false);
  const [columnsToVisible, setColumnsToVisible] = React.useState([]);
  React.useEffect(() => {
    setIsLoading(true);
    fetchColumnsToVisible();
    fetchData();
    fetchCurrency();
    // setIsLoading(false);
    varia()
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const initialUrl = `${window.siteUrl}/wp-json/wc/v3/products${isTrash ? "?status=trash&" : "?"}page=1&per_page=20`;
      const firstPageResponse = await getApi(initialUrl);
      let allData = firstPageResponse.data; 
      let totalCount = parseInt(firstPageResponse.headers["x-wp-total"], 10);
      let totalPages = Math.ceil(totalCount / 20);
      let currentPage = 2;
      setData(allData); 
      setIsLoading(false);
  
      while (currentPage <= totalPages) {
        const subsequentUrl = `${window.siteUrl}/wp-json/wc/v3/products${isTrash ? "?status=trash&" : "?"}page=${currentPage}&per_page=20`;
        const response = await getApi(subsequentUrl);
        allData = allData.concat(response.data);
        currentPage++;
      }
      setData(allData)
      // עבד כל מוצר לבדוק אם יש לו וריאנטים
      for (let i = 0; i < allData.length; i++) {
        if (allData[i].has_options) {
          const variantUrl = `${window.siteUrl}/wp-json/wc/v3/products/${allData[i].id}/variations`;
          try {
            const variantResponse = await getApi(variantUrl);
            allData[i].subRows = variantResponse.data;
          } catch (error) {

            console.error("Error fetching variants", error);
          }
        }
      }
      setData([...allData]); 
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchColumnsToVisible = async () => {
    const url = window.siteUrl + "/wp-json/woocomanage/v1/columns/columnName";
    const response = await getApi(url);
    setColumnsToVisible(response.data[0].reservedData);
  };

  const fetchCurrency = async () => {
    const url = window.siteUrl + "/wp-json/wc/v3/system_status/";
    const response = await getApi(url);
    window.currency = response.data.settings.currency_symbol;
  };
  const varia = async () => {
    const url = window.siteUrl + "/wp-json/wc/v3/products/79/variations";
    const response = await getApi(url);
  };

  return (
    <div className="max-w-full overflow-x-auto overflow-hidden min-h-full">
      <DataTable
        data={data}
        setData={setData}
        columns={columns}
        isLoading={isLoading}
        fetchData={fetchData}
        isTrash={isTrash}
        setIsTrash={setIsTrash}
        columnsToVisible={columnsToVisible}
        setColumnsToVisible={setColumnsToVisible}
      />
      {/* {console.log(data)} */}
    </div>
  );
}

export default DashboardPage;
