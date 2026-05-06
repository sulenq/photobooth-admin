"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Menu } from "@/components/ui/menu";
import { SearchInput } from "@/components/ui/search-input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { TextareaInput } from "@/components/ui/textarea-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import { Confirmation } from "@/components/widgets/confirmation";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { Item } from "@/components/widgets/item";
import { SimpleDisclosure } from "@/components/widgets/simple-disclosure";
import { View, useViewContext } from "@/components/widgets/view";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useFetchData } from "@/hooks/useFetchData";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { useRequest } from "@/hooks/useRequest";
import { TENANT_BASE_ENDPOINT } from "@/shared/constants/apiEndpoints";
import { DUMMY_TENANTS } from "@/shared/constants/dummyData";
import {
  BatchOptionsTableOptionGenerator,
  DataConfig,
  RowOptionsTableOptionGenerator,
  Tenant,
} from "@/shared/constants/interfaces";
import { GAP } from "@/shared/constants/styles";
import { isEmptyArray, last } from "@/shared/utils/array";
import { back } from "@/shared/utils/client";
import { disclosureId } from "@/shared/utils/disclosure";
import { formatDate } from "@/shared/utils/formatter";
import { capitalize, pluckString } from "@/shared/utils/string";
import { getActiveNavs } from "@/shared/utils/url";
import { HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

type DataInterface = Tenant;

const BASE_ENDPOINT = TENANT_BASE_ENDPOINT;
const PREFIX_ID = `tenant`;
const DEFAULT_FILTER = {
  search: "",
};

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
      tenantCode: "",
      name: "",
      address: "",
    },
    validationSchema: yup.object().shape({
      tenantCode: yup.string().required("Code is required"),
      name: yup.string().required("Name is required"),
      address: yup.string().required("Address is required"),
    }),
    onSubmit: (values) => {
      console.debug(values);

      back();

      // const payload = new FormData();
      // payload.append("name", values.name);
      // payload.append("code", values.code);
      // payload.append("price", values.price?.toString() || "");
      // payload.append("image", values.image?.[0] || "");
      const payload = values;

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
          {/* Add */}
        </Btn>
      </Tooltip>

      <SimpleDisclosure
        // withMaximizeButton
        open={open}
        title={`Edit ${routeTitle}`}
        bodyContent={
          <CContainer>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Code"}
                  invalid={!!formik.errors.tenantCode}
                  errorText={formik.errors.tenantCode as string}
                >
                  <StringInput
                    inputValue={formik.values.tenantCode}
                    onChange={(inputValue) => {
                      formik.setFieldValue("tenantCode", inputValue);
                    }}
                  />
                </Field>

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
                  label={"Price"}
                  invalid={!!formik.errors.address}
                  errorText={formik.errors.address as string}
                >
                  <TextareaInput
                    inputValue={formik.values.address}
                    onChange={(inputValue) => {
                      formik.setFieldValue("address", inputValue);
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
      tenantCode: "",
      name: "",
      address: "",
    },
    validationSchema: yup.object().shape({
      tenantCode: yup.string().required("Name is required"),
      name: yup.string().required("Name is required"),
      address: yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {
      console.debug(values);

      back();

      // const payload = new FormData();
      // payload.append("tenantCode", values.tenantCode);
      // payload.append("name", values.name);
      // payload.append("address", values.address);
      const payload = values;

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
      address: resolvedData.address,
      tenantCode: resolvedData.tenantCode,
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
        // withMaximizeButton
        open={open}
        title={`Edit ${routeTitle}`}
        bodyContent={
          <CContainer>
            <form id={ID} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Code"}
                  invalid={!!formik.errors.tenantCode}
                  errorText={formik.errors.tenantCode as string}
                >
                  <StringInput
                    inputValue={formik.values.tenantCode}
                    onChange={(inputValue) => {
                      formik.setFieldValue("tenantCode", inputValue);
                    }}
                  />
                </Field>

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
                  label={"Price"}
                  invalid={!!formik.errors.address}
                  errorText={formik.errors.address as string}
                >
                  <TextareaInput
                    inputValue={formik.values.address}
                    onChange={(inputValue) => {
                      formik.setFieldValue("address", inputValue);
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

// const Restore = (props: any) => {
//   const ID = `${PREFIX_ID}_restore`;

//   // Props
//   const { restoreIds, clearSelectedRows, disabled, routeTitle } = props;

//   // Contexts
//   const { t } = useLocale();
//   const setRt = useRenderTrigger((s) => s.setRt);

//   // Hooks
//   const { req, loading } = useRequest({
//     id: ID,
//     loadingMessage: {
//       title: capitalize(`${t.restore} ${routeTitle}`),
//     },
//     successMessage: {
//       title: capitalize(`${t.restore} ${routeTitle} ${t.successful}`),
//     },
//   });

//   // Utils
//   function onActivate() {
//     back();
//     req({
//       config: {
//         url: `${BASE_ENDPOINT}/restore`,
//         method: "PATCH",
//         data: {
//           restoreIds: restoreIds,
//         },
//       },
//       onResolve: {
//         onSuccess: () => {
//           setRt((ps) => !ps);
//           clearSelectedRows?.();
//         },
//       },
//     });
//   }

//   return (
//     <Confirmation.Trigger
//       w={"full"}
//       id={`${ID}-${restoreIds}`}
//       title={`${t.restore} ${routeTitle}`}
//       description={t.msg_activate}
//       confirmLabel={`${t.restore}`}
//       onConfirm={onActivate}
//       loading={loading}
//       disabled={disabled}
//     >
//       <Tooltip
//         content={t.restore}
//         positioning={{
//           placement: "right",
//         }}
//       >
//         <Menu.Item value={"restore"} disabled={disabled}>
//           <AppIconLucide icon={UndoIcon} />
//           {t.restore}
//         </Menu.Item>
//       </Tooltip>
//     </Confirmation.Trigger>
//   );
// };

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
        queryKey={"q-user"}
        inputProps={{
          size: "sm",
        }}
        minW={"200px"}
        inputValue={filter.search}
        onChange={(inputValue) => {
          setFilter((ps) => ({ ...ps, search: inputValue }));
        }}
      />

      {/* <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={ListFilterIcon} />
        </Icon>
      </Btn>

      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={ArrowDownAz} />
        </Icon>
      </Btn> */}

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
    dummyData: DUMMY_TENANTS,
    // TODO_DEV fetch data url
    url: `${BASE_ENDPOINT}/get`,
    params: {
      search: filter?.search,
      // others params
    },
    dependencies: [filter],
  });

  // Derived Values
  const dataConfig: DataConfig = {
    headers: [
      {
        th: "Name",
        sortable: true,
      },
      {
        th: "Code",
        sortable: true,
      },
      {
        th: "Address",
        sortable: true,
      },
      {
        th: "Created At",
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
            value: item.name,
            td: item.name,
          },
          {
            value: item.tenantCode,
            td: item.tenantCode,
          },
          {
            value: item.address,
            td: item.address,
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
      // (row) => ({
      //   override: (
      //     <Restore
      //       restoreIds={[row.data.id]}
      //       disabled={!row.data.deletedAt}
      //       routeTitle={routeTitle}
      //     />
      //   ),
      // }),
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
      // (ids, { clearSelectedRows }) => ({
      //   override: (
      //     <Restore
      //       restoreIds={ids}
      //       clearSelectedRows={clearSelectedRows}
      //       disabled={
      //         isEmptyArray(ids) ||
      //         data
      //           ?.filter((item) => ids.includes(item.id))
      //           .some((item) => !item.deletedAt)
      //       }
      //       routeTitle={routeTitle}
      //     />
      //   ),
      // }),
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
        <View.Header minH={""} mb={GAP}>
          <HStack w={"full"}>
            <DataUtils
              filter={filter}
              setFilter={setFilter}
              routeTitle={routeTitle}
            />

            <Create routeTitle={routeTitle} />
          </HStack>
        </View.Header>

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
