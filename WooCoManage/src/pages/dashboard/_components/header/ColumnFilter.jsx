import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Label } from "@components/ui/label";
import { Switch } from "@components/ui/switch";
import { Spinner } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export const columnFilterFn = (row, columnId, filterValue) => {
  if (filterValue.length === 0) return true;

  const keyPath = "name";
  const rowValue = row.getValue(columnId);

  // בדיקה עבור סינון "ללא ערך"
  if (filterValue.includes("[None]")) {
    // בדיקה אם הערך בשורה הוא 'ריק' לפי ההגדרות הרחבות
    const isValueEmpty = checkIfValueIsEmpty(rowValue, keyPath);
    if (filterValue.length > 1) {
      // אם ישנם עוד ערכים לסינון בנוסף ל"[None]"
      const otherValues = filterValue.filter((v) => v !== "[None]");
      return isValueEmpty || checkOtherValues(rowValue, otherValues, keyPath);
    } else {
      return isValueEmpty;
    }
  }

  // טיפול בסינון של שאר הערכים
  return checkOtherValues(rowValue, filterValue, keyPath);
};

// פונקציה לבדיקה אם ערך 'ריק'
function checkIfValueIsEmpty(value, keyPath) {
  if (Array.isArray(value)) {
    return (
      value.length === 0 ||
      value.every((item) => checkIfValueIsEmpty(item, keyPath))
    );
  } else if (typeof value === "object" && value !== null) {
    return !(keyPath in value) || checkIfValueIsEmpty(value[keyPath], keyPath);
  }
  return value === null || value === undefined || value === "";
}

// פונקציה עזר לבדוק את שאר הערכים
function checkOtherValues(rowValue, filterValue, keyPath) {
  if (Array.isArray(rowValue)) {
    return rowValue.some((item) => {
      if (typeof item === "object" && item !== null && keyPath in item) {
        return filterValue.includes(item[keyPath]);
      }
      return filterValue.includes(item);
    });
  } else if (
    rowValue &&
    typeof rowValue === "object" &&
    rowValue !== null &&
    keyPath in rowValue
  ) {
    return filterValue.includes(rowValue[keyPath]);
  }
  return filterValue.includes(rowValue);
}


const ColumnFilter = ({
  setColumnFilters,
  data,
  column,
  defaultValues,
  keyPath = "name",
}) => {
  const [filterValue, setFilterValue] = useState(defaultValues);
  const [uniqueValues, setUniqueValues] = useState([]);
  const [valueCounts, setValueCounts] = useState({});
  const [isFilterActive, setIsFilterActive] = useState(false);

  const getAllUniqueValues = (data, columnName, keyPath) => {
    const uniqueValues = new Set();
    data.forEach((row) => {
      const item = row[columnName];
      if (typeof item === "string") {
        uniqueValues.add(item);
      } else if (Array.isArray(item)) {
        item.forEach((innerItem) => {
          if (typeof innerItem === "object" && keyPath in innerItem) {
            uniqueValues.add(innerItem[keyPath]);
          } else {
            uniqueValues.add(innerItem);
          }
        });
      } else if (item && typeof item === "object" && keyPath in item) {
        uniqueValues.add(item[keyPath]);
      }
    });
    return Array.from(uniqueValues);
  };

  const getValueCounts = (data, columnName, keyPath) => {
    return data.reduce((acc, row) => {
      const item = row[columnName];
      let value;

      if (typeof item === "string") {
        value = item;
      } else if (Array.isArray(item)) {
        item.forEach((innerItem) => {
          if (typeof innerItem === "object" && keyPath in innerItem) {
            value = innerItem[keyPath];
            acc[value] = (acc[value] || 0) + 1;
          } else {
            acc[innerItem] = (acc[innerItem] || 0) + 1;
          }
        });
        return acc;
      } else if (item && typeof item === "object" && keyPath in item) {
        value = item[keyPath];
      }

      if (value !== undefined) {
        acc[value] = (acc[value] || 0) + 1;
      }

      return acc;
    }, {});
  };

  useEffect(() => {
    const counts = getValueCounts(data, column, keyPath);
    setValueCounts(counts);
  }, [data, setValueCounts]);

  useEffect(() => {
    if (filterValue.length > 0 && filterValue[0] !== "") {
      setIsFilterActive(true);
    } else setIsFilterActive(false);
  }, [filterValue]);

  useEffect(() => {
    if (defaultValues.length === 1 && defaultValues[0] === "") {
      setFilterValue([]);
      setIsFilterActive(false);
    } else setIsFilterActive(true);
  }, [defaultValues]);

  useEffect(() => {
    const uniqueValues = getAllUniqueValues(data, column, keyPath);
    setUniqueValues(uniqueValues); // עדכון המשתנה בערכים הייחודיים
  }, [data, column, keyPath]);

  useEffect(() => {
    setColumnFilters((old) => [
      ...old.filter((filter) => filter.id !== column),
      { id: column, value: filterValue },
    ]);
  }, [filterValue, setColumnFilters]);
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              isFilterActive
                ? "bg-fuchsia-50 hover:bg-fuchsia-100 border-primary"
                : "border-slate-400 dark:border-slate-500 text-muted-foreground",
              "border-dashed capitalize h-8 px-2"
            )}
            variant="outline"
          >
            <ChevronDown className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 select-none" />
            {column}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-h-[222px] overflow-y-auto"
        >
          <DropdownMenuLabel className="flex items-center justify-between">
            <Label htmlFor="airplane-mode" className="flex-1 h-full">
              Enable
            </Label>
            <Switch
              className=""
              id="airplane-mode"
              checked={isFilterActive}
              onCheckedChange={() => {
                filterValue.length > 0
                  ? setFilterValue([])
                  : setFilterValue(uniqueValues);
              }}
            />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {uniqueValues[0] ? (
            uniqueValues.map((valueOption) => (
              <DropdownMenuCheckboxItem
                key={valueOption}
                className="text-end hover:!bg-fuchsia-600 capitalize hover:!text-white group transition-colors"
                checked={filterValue.includes(valueOption)}
                onCheckedChange={(isChecked) => {
                  setFilterValue((currentFilterValue) =>
                    isChecked
                      ? [...currentFilterValue, valueOption]
                      : currentFilterValue.filter(
                          (value) => value !== valueOption
                        )
                  );
                }}
              >
                <p className="flex gap-1">
                  <span className="text-slate-400 group-hover:text-fuchsia-200">
                    ({valueCounts[valueOption] || 0})
                  </span>
                  <span>{valueOption}</span>
                </p>
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <div className="w-full flex justify-center items-center py-4">
              <Spinner />
            </div>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            key="no-value"
            className="text-end hover:bg-fuchsia-600 capitalize hover:text-white transition-colors"
            checked={filterValue.includes("[None]")}
            onCheckedChange={(isChecked) => {
              setFilterValue((currentFilterValue) =>
                isChecked
                  ? [...currentFilterValue, "[None]"]
                  : currentFilterValue.filter((value) => value !== "[None]")
              );
            }}
          >
            <p>No Value</p>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColumnFilter;
