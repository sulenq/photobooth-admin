"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Menu } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { SearchInput } from "@/components/ui/search-input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import { Confirmation } from "@/components/widgets/confirmation";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { Item } from "@/components/widgets/item";
import { ScrollH } from "@/components/widgets/scroll-h";
import { SimpleDisclosure } from "@/components/widgets/simple-disclosure";
import { View, useViewContext } from "@/components/widgets/view";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useFetchData } from "@/hooks/useFetchData";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { useRequest } from "@/hooks/useRequest";
import { VOUCHER_BASE_ENDPOINT } from "@/shared/constants/apiEndpoints";
import { DUMMY_VOUCHER } from "@/shared/constants/dummyData";
import {
  BatchOptionsTableOptionGenerator,
  DataConfig,
  RowOptionsTableOptionGenerator,
  Voucher,
} from "@/shared/constants/interfaces";
import { GAP, R_SPACING_MD } from "@/shared/constants/styles";
import { isEmptyArray, last } from "@/shared/utils/array";
import { back } from "@/shared/utils/client";
import { disclosureId } from "@/shared/utils/disclosure";
import { formatDate, formatNumber } from "@/shared/utils/formatter";
import { capitalize, pluckString } from "@/shared/utils/string";
import { getActiveNavs } from "@/shared/utils/url";
import { Badge, HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

type DataInterface = Voucher;

const BASE_ENDPOINT = VOUCHER_BASE_ENDPOINT;
const PREFIX_ID = `voucher`;
const DEFAULT_FILTER = {
  search: "",
};

// -----------------------------------------------------------------

interface CreateProps extends BtnProps {
  routeTitle: string;
}

const Create = (props: CreateProps) => {
  const ID = `${PREFIX_ID}_create`;

  // Props
  const { routeTitle, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId(`${ID}`));
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Add ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`Add ${routeTitle} ${t.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      name: "",
      value: null as number | null,
      isPercentage: false,
      isLimit: false,
      limitQty: null as number | null,
      limitRp: null as number | null,
      dateFrom: null as string[] | null,
      dateTo: null as string[] | null,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      value: yup.number().required("Value is required"),
    }),
    onSubmit: (values) => {
      back();

      const payload = {
        name: values.name,
        value: values.value?.toString() || "",
        isPercentage: values.isPercentage,
        isLimit: values.isLimit,
        limitQty: values.isLimit ? values.limitQty : null,
        limitRp: values.isLimit ? values.limitRp : null,
        dateFrom: values.dateFrom?.[0] || null,
        dateTo: values.dateTo?.[0] || null,
      };

      const config = {
        url: `${BASE_ENDPOINT}/create`,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  return (
    <>
      <Tooltip content={t.add}>
        <Btn
          iconButton
          size={"sm"}
          colorPalette={themeConfig.colorPalette}
          onClick={onOpen}
          {...restProps}
        >
          <AppIconLucide icon={PlusIcon} />
        </Btn>
      </Tooltip>

      <SimpleDisclosure
        open={open}
        title={`Add ${routeTitle}`}
        bodyContent={
          <CContainer>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Name"}
                  invalid={!!formik.errors.name}
                  errorText={formik.errors.name as string}
                >
                  <StringInput
                    inputValue={formik.values.name}
                    onChange={(inputValue) => {
                      formik.setFieldValue("name", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={"Value"}
                  invalid={!!formik.errors.value}
                  errorText={formik.errors.value as string}
                >
                  <NumInput
                    inputValue={formik.values.value}
                    onChange={(inputValue) => {
                      formik.setFieldValue("value", inputValue);
                    }}
                  />
                </Field>

                <Field label={"Percentage"}>
                  <Switch
                    checked={formik.values.isPercentage}
                    onCheckedChange={(details) => {
                      formik.setFieldValue("isPercentage", details.checked);
                    }}
                    colorPalette={themeConfig.colorPalette}
                  >
                    Percentage
                  </Switch>
                </Field>

                <Field label={"Has Limit"}>
                  <Switch
                    checked={formik.values.isLimit}
                    onCheckedChange={(details) => {
                      formik.setFieldValue("isLimit", details.checked);
                      if (!details.checked) {
                        formik.setFieldValue("limitQty", null);
                        formik.setFieldValue("limitRp", null);
                      }
                    }}
                    colorPalette={themeConfig.colorPalette}
                  >
                    Has Limit
                  </Switch>
                </Field>

                {formik.values.isLimit && (
                  <>
                    <Field
                      label={"Limit Qty"}
                      invalid={!!formik.errors.limitQty}
                      errorText={formik.errors.limitQty as string}
                    >
                      <NumInput
                        inputValue={formik.values.limitQty}
                        onChange={(inputValue) => {
                          formik.setFieldValue("limitQty", inputValue);
                        }}
                      />
                    </Field>

                    <Field
                      label={"Limit Rp"}
                      invalid={!!formik.errors.limitRp}
                      errorText={formik.errors.limitRp as string}
                    >
                      <NumInput
                        inputValue={formik.values.limitRp}
                        onChange={(inputValue) => {
                          formik.setFieldValue("limitRp", inputValue);
                        }}
                      />
                    </Field>
                  </>
                )}

                <Field
                  label={"Date From"}
                  invalid={!!formik.errors.dateFrom}
                  errorText={formik.errors.dateFrom as string}
                >
                  <DatePickerInput
                    id={`${ID}-date-from`}
                    inputValue={formik.values.dateFrom}
                    onChange={(inputValue) => {
                      formik.setFieldValue("dateFrom", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={"Date To"}
                  invalid={!!formik.errors.dateTo}
                  errorText={formik.errors.dateTo as string}
                >
                  <DatePickerInput
                    id={`${ID}-date-to`}
                    inputValue={formik.values.dateTo}
                    onChange={(inputValue) => {
                      formik.setFieldValue("dateTo", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </CContainer>
        }
        footerContent={
          <>
            <BackButton variant={"outline"}>Discard</BackButton>

            <Btn
              type={"submit"}
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {t.save}
            </Btn>
          </>
        }
      />
    </>
  );
};

// -----------------------------------------------------------------

interface UpdateProps {
  data: DataInterface;
  routeTitle: string;
}

const Update = (props: UpdateProps) => {
  const ID = `${PREFIX_ID}_update`;

  // Props
  const { data, routeTitle } = props;
  const resolvedData = data as DataInterface;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(`${ID}-${resolvedData?.id}`),
  );
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Edit ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`Edit ${routeTitle} ${t.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      name: "",
      value: null as number | null,
      isPercentage: false,
      isLimit: false,
      limitQty: null as number | null,
      limitRp: null as number | null,
      dateFrom: null as string[] | null,
      dateTo: null as string[] | null,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      value: yup.number().required("Value is required"),
    }),
    onSubmit: (values) => {
      back();

      const payload = {
        name: values.name,
        value: values.value?.toString() || "",
        isPercentage: values.isPercentage,
        isLimit: values.isLimit,
        limitQty: values.isLimit ? values.limitQty : null,
        limitRp: values.isLimit ? values.limitRp : null,
        dateFrom: values.dateFrom?.[0] || null,
        dateTo: values.dateTo?.[0] || null,
      };

      const config = {
        url: `${BASE_ENDPOINT}/update/${resolvedData?.id}`,
        method: "UPDATE",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  // set initial values
  useEffect(() => {
    formik.setValues({
      name: resolvedData.name,
      value: parseFloat(resolvedData.value),
      isPercentage: resolvedData.isPercentage,
      isLimit: resolvedData.isLimit,
      limitQty: resolvedData.limitQty,
      limitRp: resolvedData.limitRp,
      dateFrom: resolvedData.dateFrom ? [resolvedData.dateFrom] : null,
      dateTo: resolvedData.dateTo ? [resolvedData.dateTo] : null,
    });
  }, [open, resolvedData]);

  return (
    <>
      <Tooltip
        content={"Edit"}
        positioning={{
          placement: "right",
        }}
      >
        <Menu.Item value={"edit"} onClick={onOpen}>
          <AppIconLucide icon={EditIcon} />
          Edit
        </Menu.Item>
      </Tooltip>

      <SimpleDisclosure
        open={open}
        title={`Edit ${routeTitle}`}
        bodyContent={
          <CContainer>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Name"}
                  invalid={!!formik.errors.name}
                  errorText={formik.errors.name as string}
                >
                  <StringInput
                    inputValue={formik.values.name}
                    onChange={(inputValue) => {
                      formik.setFieldValue("name", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={"Value"}
                  invalid={!!formik.errors.value}
                  errorText={formik.errors.value as string}
                >
                  <NumInput
                    inputValue={formik.values.value}
                    onChange={(inputValue) => {
                      formik.setFieldValue("value", inputValue);
                    }}
                  />
                </Field>

                <Field label={"Percentage"}>
                  <Switch
                    checked={formik.values.isPercentage}
                    onCheckedChange={(details) => {
                      formik.setFieldValue("isPercentage", details.checked);
                    }}
                    colorPalette={themeConfig.colorPalette}
                  >
                    Percentage
                  </Switch>
                </Field>

                <Field label={"Has Limit"}>
                  <Switch
                    checked={formik.values.isLimit}
                    onCheckedChange={(details) => {
                      formik.setFieldValue("isLimit", details.checked);
                      if (!details.checked) {
                        formik.setFieldValue("limitQty", null);
                        formik.setFieldValue("limitRp", null);
                      }
                    }}
                    colorPalette={themeConfig.colorPalette}
                  >
                    Has Limit
                  </Switch>
                </Field>

                {formik.values.isLimit && (
                  <>
                    <Field
                      label={"Limit Qty"}
                      invalid={!!formik.errors.limitQty}
                      errorText={formik.errors.limitQty as string}
                    >
                      <NumInput
                        inputValue={formik.values.limitQty}
                        onChange={(inputValue) => {
                          formik.setFieldValue("limitQty", inputValue);
                        }}
                      />
                    </Field>

                    <Field
                      label={"Limit Rp"}
                      invalid={!!formik.errors.limitRp}
                      errorText={formik.errors.limitRp as string}
                    >
                      <NumInput
                        inputValue={formik.values.limitRp}
                        onChange={(inputValue) => {
                          formik.setFieldValue("limitRp", inputValue);
                        }}
                      />
                    </Field>
                  </>
                )}

                <Field
                  label={"Date From"}
                  invalid={!!formik.errors.dateFrom}
                  errorText={formik.errors.dateFrom as string}
                >
                  <DatePickerInput
                    id={`${ID}-date-from-${resolvedData?.id}`}
                    inputValue={formik.values.dateFrom}
                    onChange={(inputValue) => {
                      formik.setFieldValue("dateFrom", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={"Date To"}
                  invalid={!!formik.errors.dateTo}
                  errorText={formik.errors.dateTo as string}
                >
                  <DatePickerInput
                    id={`${ID}-date-to-${resolvedData?.id}`}
                    inputValue={formik.values.dateTo}
                    onChange={(inputValue) => {
                      formik.setFieldValue("dateTo", inputValue);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </CContainer>
        }
        footerContent={
          <>
            <BackButton variant={"outline"}>Discard</BackButton>

            <Btn
              type={"submit"}
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {t.save}
            </Btn>
          </>
        }
      />
    </>
  );
};

// -----------------------------------------------------------------

const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { t } = useLocale();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${t.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${t.delete_} ${routeTitle} ${t.successful}`),
    },
  });

  // Utils
  function onDeactivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/delete`,
        method: "DELETE",
        data: {
          deleteIds: deleteIds,
        },
      },
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          clearSelectedRows?.();
        },
      },
    });
  }

  return (
    <Confirmation.Trigger
      w={"full"}
      id={`${ID}-${deleteIds}`}
      title={`${t.delete_} ${routeTitle}`}
      description={t.msg_soft_delete}
      confirmLabel={`${t.delete_}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        colorPalette: "gray",
        variant: "outline",
        color: "fg.error",
      }}
      loading={loading}
      disabled={disabled}
    >
      <Tooltip
        content={t.delete_}
        positioning={{
          placement: "right",
        }}
      >
        <Menu.Item
          value={"delete"}
          disabled={disabled}
          color={"fg.error"}
          transition={"200ms"}
        >
          <AppIconLucide icon={TrashIcon} />
          {t.delete_}
        </Menu.Item>
      </Tooltip>
    </Confirmation.Trigger>
  );
};

// -----------------------------------------------------------------

interface DataUtilsProps {
  routeTitle: string;
  filter: typeof DEFAULT_FILTER;
  setFilter: React.Dispatch<React.SetStateAction<typeof DEFAULT_FILTER>>;
}

const DataUtils = (props: DataUtilsProps) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack w={"full"} {...restProps}>
      <SearchInput
        queryKey={"q-voucher"}
        inputProps={{
          size: "sm",
        }}
        minW={"200px"}
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter((ps) => ({ ...ps, search: inputValue }));
        }}
      />

      {/* <DataDisplayToggle iconButton navKey={PREFIX_ID} size={"sm"} /> */}
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
  const { filter, routeTitle } = props;

  // Contexts
  const { t } = useLocale();

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
    dummyData: DUMMY_VOUCHER,
    // TODO_DEV fetch data url
    url: ``,
    params: {
      search: filter?.search,
    },
    dependencies: [filter],
  });

  // Helpers
  function formatValue(item: DataInterface) {
    return item.isPercentage
      ? `${item.value}%`
      : `Rp ${formatNumber(parseFloat(item.value))}`;
  }
  function formatLimit(item: DataInterface) {
    if (!item.isLimit) return "No Limit";
    if (item.limitQty != null) return `${formatNumber(item.limitQty)} pcs`;
    if (item.limitRp != null) return `Rp ${formatNumber(item.limitRp)}`;
    return "-";
  }
  function formatPeriod(item: DataInterface) {
    if (!item.dateFrom && !item.dateTo) return "No Limit";
    const from = item.dateFrom
      ? formatDate(item.dateFrom, t, {
          variant: "dayShortMonthYear",
        })
      : "?";
    const to = item.dateTo
      ? formatDate(item.dateTo, t, {
          variant: "dayShortMonthYear",
        })
      : "?";
    return `${from} – ${to}`;
  }

  // Derived Values
  const dataConfig: DataConfig = {
    headers: [
      {
        th: "Name",
        sortable: true,
      },
      {
        th: "Value",
        sortable: true,
      },
      {
        th: "Limit",
      },
      {
        th: "Period",
      },
      {
        th: "Used",
        sortable: true,
      },
      {
        th: "Status",
        sortable: true,
      },
      {
        th: "Created At",
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => {
      const now = new Date();
      const dateTo = item.dateTo ? new Date(item.dateTo) : null;
      const isValid = dateTo ? dateTo <= now : true;

      return {
        id: item.id,
        idx: idx,
        data: item,
        dim: !!item.deletedAt,
        columns: [
          {
            value: item.name,
            td: item.name,
          },
          {
            value: item.value,
            td: formatValue(item),
          },
          {
            value: item.limitQty ?? item.limitRp ?? 0,
            td: formatLimit(item),
          },
          {
            value: item.dateFrom,
            td: formatPeriod(item),
          },
          {
            value: item.used,
            td: `${formatNumber(item.used)} x`,
            dataType: "number",
          },
          {
            value: item.dateTo,
            td: (
              <Badge colorPalette={isValid ? "green" : "red"}>
                {isValid ? "Active" : "Expired"}
              </Badge>
            ),
          },
          {
            value: item.createdAt,
            td: formatDate(item.createdAt, t),
          },
        ],
      };
    }),
    rowOptions: [
      (row) => ({
        override: <Update data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: (
          <Delete
            deleteIds={[row.data.id]}
            disabled={!!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as RowOptionsTableOptionGenerator<DataInterface>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Delete
            deleteIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => !!item.deletedAt)
            }
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as BatchOptionsTableOptionGenerator[],
  };

  // Render State Map
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: (
      <DataTable.Display
        headers={dataConfig.headers}
        rows={dataConfig.rows}
        rowOptions={dataConfig.rowOptions}
        batchOptions={dataConfig.batchOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.totalPage}
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
              <DataUtils
                filter={filter}
                setFilter={setFilter}
                routeTitle={routeTitle}
              />
            )}

            <Create routeTitle={routeTitle} />
          </HStack>
        </View.Header>

        {isSmContainer && (
          <ScrollH mb={4}>
            <HStack minW={"full"} justify={"space-between"} px={R_SPACING_MD}>
              <DataUtils
                filter={filter}
                setFilter={setFilter}
                routeTitle={routeTitle}
              />
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
