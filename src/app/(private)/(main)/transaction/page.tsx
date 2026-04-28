"use client";

import { CContainer } from "@/components/ui/c-container";
import { SearchInput } from "@/components/ui/search-input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { DataDisplayToggle } from "@/components/widgets/data-display-toggle";
import { DataGrid } from "@/components/widgets/data-grid";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { Item } from "@/components/widgets/item";
import { ScrollH } from "@/components/widgets/scroll-h";
import { View, useViewContext } from "@/components/widgets/view";
import { TRANSACTION_BASE_ENDPOINT } from "@/shared/constants/apiEndpoints";
import { DUMMY_TRANSACTION } from "@/shared/constants/dummyData";
import { DataConfig, Transaction } from "@/shared/constants/interfaces";
import { GAP, R_SPACING_MD } from "@/shared/constants/styles";
import { useDataDisplay } from "@/contexts/useDataDisplay";
import { useLocale } from "@/contexts/useLocale";
import { useFetchData } from "@/hooks/useFetchData";
import { isEmptyArray, last } from "@/shared/utils/array";
import { formatDate, formatNumber } from "@/shared/utils/formatter";
import { pluckString } from "@/shared/utils/string";
import { getActiveNavs } from "@/shared/utils/url";
import { Badge, HStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type DataInterface = Transaction;

const BASE_ENDPOINT = TRANSACTION_BASE_ENDPOINT;
const PREFIX_ID = `transaction`;
const DEFAULT_FILTER = {
  search: "",
};

// -----------------------------------------------------------------

interface DataUtilsProps {
  filter: typeof DEFAULT_FILTER;
  setFilter: React.Dispatch<React.SetStateAction<typeof DEFAULT_FILTER>>;
}

const DataUtils = (props: DataUtilsProps) => {
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack w={"full"} {...restProps}>
      <SearchInput
        queryKey={"q-transaction"}
        inputProps={{
          size: "sm",
        }}
        minW={"200px"}
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter((ps) => ({ ...ps, search: inputValue }));
        }}
      />

      <DataDisplayToggle iconButton navKey={PREFIX_ID} size={"sm"} />
    </HStack>
  );
};

// -----------------------------------------------------------------

interface DataProps {
  filter: typeof DEFAULT_FILTER;
  routeTitle: string;
  isSmContainer: boolean;
}

const Data = (props: DataProps) => {
  // Props
  const { filter, routeTitle, isSmContainer } = props;

  // Contexts
  const { t } = useLocale();
  const displayMode = useDataDisplay((s) => s.getDisplay(PREFIX_ID));
  const displayTable = displayMode === "table";

  // States
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    page,
    setPage,
    pagination,
  } = useFetchData<DataInterface[]>({
    dummyData: DUMMY_TRANSACTION,
    url: `${BASE_ENDPOINT}/index`,
    params: {
      search: filter?.search,
    },
    dependencies: [filter],
  });

  // Helpers
  function statusColorPalette(status: string) {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "green";
      case "PENDING":
        return "yellow";
      case "FAILED":
        return "red";
      default:
        return "gray";
    }
  }

  // Derived Values
  const dataConfig: DataConfig = {
    headers: [
      {
        th: "Invoice",
        sortable: true,
      },
      {
        th: "Product",
        sortable: true,
      },
      {
        th: "Price",
        sortable: true,
      },
      {
        th: "Qty",
        sortable: true,
      },
      {
        th: "Voucher",
      },
      {
        th: "Voucher Price",
        sortable: true,
      },
      {
        th: "Grand Total",
        sortable: true,
      },
      {
        th: "Date",
        sortable: true,
      },
      {
        th: "Status",
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => {
      return {
        id: item.id,
        idx: idx,
        data: item,
        dim: !!item.deletedAt,
        columns: [
          {
            value: item.invoiceNumber,
            td: item.invoiceNumber,
          },
          {
            value: item.productName,
            td: `${item.productName} (${item.productCode})`,
          },
          {
            value: item.price,
            td: `Rp ${formatNumber(item.price)}`,
            dataType: "number",
          },
          {
            value: item.qty,
            td: `x${item.qty}`,
            dataType: "number",
          },
          {
            value: item.voucherCode,
            td: item.voucherCode || "-",
          },
          {
            value: item.voucherPrice,
            td: item.voucherPrice
              ? `Rp ${formatNumber(item.voucherPrice)}`
              : "-",
            dataType: "number",
          },
          {
            value: item.grandTotal,
            td: `Rp ${formatNumber(item.grandTotal)}`,
            dataType: "number",
          },
          {
            value: item.transactionDate,
            td: formatDate(item.transactionDate, t),
          },
          {
            value: item.status,
            td: (
              <Badge colorPalette={statusColorPalette(item.status)}>
                {item.status}
              </Badge>
            ),
          },
        ],
      };
    }),
  };

  // Render State Map
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: displayTable ? (
      <DataTable.Display
        headers={dataConfig.headers}
        rows={dataConfig.rows}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.totalPage}
      />
    ) : (
      <DataGrid.Display
        data={data}
        dataConfig={dataConfig}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.totalPage}
        gridItem={({
          item,
          row,
          details,
          selectedRows,
          toggleRowSelection,
        }: any) => {
          const resolvedItem: DataInterface = item;

          return (
            <DataGrid.Item
              key={resolvedItem.id}
              item={{
                id: resolvedItem.id,
                showImg: false,
                title: resolvedItem.invoiceNumber,
                description: `Rp ${formatNumber(resolvedItem.grandTotal)}`,
              }}
              dataConfig={dataConfig}
              row={row}
              selectedRows={selectedRows}
              toggleRowSelection={toggleRowSelection}
              routeTitle={routeTitle}
              details={details}
            />
          );
        }}
        mt={isSmContainer ? 3 : 0}
      />
    ),
  };

  return (
    <>
      {initialLoading && render.loading}

      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {(!data || isEmptyArray(data)) && render.empty}
            </>
          )}
        </>
      )}
    </>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  // Contexts
  const { t } = useLocale();

  // Hooks
  const { isSmContainer } = useViewContext();

  // States
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname);
  const routeTitle =
    last(activeNav)?.label || pluckString(t, last(activeNav)?.labelKey || "");
  const [filter, setFilter] = useState<typeof DEFAULT_FILTER>(DEFAULT_FILTER);

  return (
    <View.Content p={GAP}>
      <CContainer flex={1} overflowY={"auto"}>
        <View.Header
          withTitle
          ViewTitleProps={{
            ml: [2, null, 0],
          }}
          justify={"space-between"}
        >
          <HStack>
            {!isSmContainer && (
              <DataUtils filter={filter} setFilter={setFilter} />
            )}
          </HStack>
        </View.Header>

        {isSmContainer && (
          <ScrollH mb={4}>
            <HStack minW={"full"} justify={"space-between"} px={R_SPACING_MD}>
              <DataUtils filter={filter} setFilter={setFilter} />
            </HStack>
          </ScrollH>
        )}

        <Item.Body flex={1} overflowY={"auto"}>
          <Data
            filter={filter}
            routeTitle={routeTitle}
            isSmContainer={isSmContainer}
          />
        </Item.Body>
      </CContainer>
    </View.Content>
  );
}
