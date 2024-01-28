import UserDashboardAI from "@/apis/UserDashboardAI";
import ConfirmAlertBox from "@/components/notification/confirm";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import useAxiosFunction from "@/hooks/useAxiosFunction";
import { IInference } from "@/interfaces/IInference";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ArrowLongDownIcon, ArrowLongUpIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { OnChangeFn, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";

type Props = {
  userId: number;
}

type Column = {
  header: string;
  accessorKey: string;
  cell?: ({ row }: any) => JSX.Element;
};

const TableInferences = ({ userId }: Props) => {
  const { auth } = useAuth();
  const [alert, setAlert] = useState<number>(0);
  const [row, setRow] = useState<any>(null);
  const [inferencesRes, inferencesErr, inferencesLoad, inferencesRefetch] = useAxios({
    axiosInstance: UserDashboardAI,
    method: "get",
    url: "/inferences/by-user",
    requestConfig: {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      },
      params: {
        user_id: userId
      },
    }
  })

  const [inferenceDelRes, inferenceDelErr, inferenceDelLoad, inferenceDelAF] = useAxiosFunction();
  const [data, setData] = useState<IInference[]>(inferencesRes)

  useEffect(() => {
    if (inferencesRes?.data) {
      let dataArray = Array.isArray(inferencesRes.data)
        ? inferencesRes.data
        : [inferencesRes.data];
      setData(dataArray)
    }
  }, [inferencesRes])

  const columns: Column[] = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Model ID",
      accessorKey: "model_id",
    },
    {
      header: "Result",
      accessorKey: "result",
      cell: ({ row }: any) => {
        const resultString = row.original.result;
        if (!resultString) {
          return <div>No result</div>;
        }

        const parsedResult = JSON.parse(resultString);
        const { message, result } = parsedResult || {};
        const { K, N, P, metrics } = result || {};
        const { mse, r2 } = metrics || {};

        return (
          <div>
            <p>Message: {message}</p>
            <p>K: {K}</p>
            <p>N: {N}</p>
            <p>P: {P}</p>
            <p>MSE: {mse}</p>
            <p>R2: {r2}</p>
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createTime",
      cell: ({ row }: any) => (
        <span>{formattedCreateTime(row.original.createTime)}</span>)
    }
  ]

  columns.push({
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }: any) => (
      <div className="ml-2 flex justify-center">
        {auth?.userId == userId.toString() && (
          <div className="flex gap-1">
            <button
              title="Delete"
              onClick={() => handleDeleteAlert(row)}
              className="border border-gray-300 p-2 rounded-md hover:bg-gray-300"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}

      </div>
    ),
  });

  const handleDeleteAlert = (row: any) => {
    console.log(row)
    setAlert(1)
    setRow(row)
  }

  const handleDelete = () => {
    setData(data.filter((item) => item.id !== row.original.id))
    inferenceDelAF({
      axiosInstance: UserDashboardAI,
      method: "delete",
      url: `/inferences/delete/${row.original.id}`,
      requestConfig: {
        headers: {
          Authorization: `Bearer ${auth?.token} `
        },
      }
    })
    setAlert(2);
  }

  const formattedCreateTime = (createTime: string) => {
    return new Date(createTime).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const handleSortingChange: OnChangeFn<SortingState> = (updaterFn) => {
    const newSortingState = typeof updaterFn === "function"
      ? updaterFn(sorting)
      : updaterFn;
    setSorting(newSortingState);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: handleSortingChange,
  });


  return (
    <div className="w-full">
      {alert == 1 && (
        <ConfirmAlertBox
          title="Delete Inference"
          description="Are you sure you want to delete this inference?"
          onClose={handleDelete}
        />
      )}
      {alert == 2 && inferenceDelRes.status == 200 && (
        <ConfirmAlertBox
          title="Delete Inference"
          description="Inference deleted successfully"
          onClose={() => { }}
        />
      )}


      <div className="relative w-full min-w-[200px] h-10 mt-5">
        <input
          id="model-title"
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="peer w-80 h-full border-gray-800 bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
          placeholder=" "
        />
        <label
          htmlFor="model-title"
          className="flex w-80 h-full border-gray-800 select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900"
        >
          Filter
        </label>
      </div>
      <div className="overflow-x-scroll">
        <table className="w-full table-auto text-center">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-5 active:bg-gray-300 focus:bg-gray-300 hover:bg-gray-300"
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                        <div className="flex items-center justify-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getIsSorted() === false && (
                            <ArrowsUpDownIcon className="h-5 w-5" />
                          )}
                          {header.column.getIsSorted() === "asc" && (
                            <ArrowLongUpIcon className="h-5 w-5" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <ArrowLongDownIcon className="h-5 w-5" />
                          )}
                        </div>
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="p-2 border-b border-blue-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-1"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-5 mb-4">
        <button
          className="border border-gray-300 p-2 rounded-md hover:bg-gray-300"
          onClick={() => table.setPageIndex(0)}
        >
          First Page
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className={`"border border-gray-300 p-2 rounded-md disabled:opacity-50 hover:bg-gray-300" ${!table.getCanPreviousPage()
            ? "disabled:opacity-50"
            : "hover:bg-gray-300"
            } `}
        >
          Previous Page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className={`"border border-gray-300 p-2 rounded-md disabled:opacity-50 hover:bg-gray-300" ${!table.getCanNextPage()
            ? "disabled:opacity-50"
            : "hover:bg-gray-300"
            } `}
        >
          Next Page
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className="border border-gray-300 p-2 rounded-md hover:bg-gray-300"
        >
          Last Page
        </button>
      </div>
    </div>
  )
}


export default TableInferences;
