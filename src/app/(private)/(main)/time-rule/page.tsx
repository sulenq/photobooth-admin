"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Menu } from "@/components/ui/menu";
import { NumInput } from "@/components/ui/number-input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { StringInput } from "@/components/ui/string-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { BackButton } from "@/components/widgets/back-button";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { Item } from "@/components/widgets/item";
import { SimpleDisclosure } from "@/components/widgets/simple-disclosure";
import { View } from "@/components/widgets/view";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useFetchData } from "@/hooks/useFetchData";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { useRequest } from "@/hooks/useRequest";
import { TIME_RULE_BASE_ENDPOINT } from "@/shared/constants/apiEndpoints";
import { DUMMY_TIME_RULE } from "@/shared/constants/dummyData";
import {
  DataConfig,
  RowOptionsTableOptionGenerator,
  TimeRule,
} from "@/shared/constants/interfaces";
import { GAP } from "@/shared/constants/styles";
import { isEmptyArray, last } from "@/shared/utils/array";
import { back } from "@/shared/utils/client";
import { disclosureId } from "@/shared/utils/disclosure";
import { formatDate, formatDuration } from "@/shared/utils/formatter";
import { capitalize, pluckString } from "@/shared/utils/string";
import { getActiveNavs } from "@/shared/utils/url";
import { useFormik } from "formik";
import { EditIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as yup from "yup";

type DataInterface = TimeRule;

const BASE_ENDPOINT = TIME_RULE_BASE_ENDPOINT;
const PREFIX_ID = `product`;

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
      duration: null as number | null,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Name is required"),
      duration: yup.number().required("Price is required"),
    }),
    onSubmit: (values) => {
      console.debug(values);

      back();

      const payload = new FormData();
      payload.append("name", values.name);
      payload.append("duration", values.duration?.toString() || "");

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
      duration: resolvedData.duration,
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
                  label={"Duration (second)"}
                  invalid={!!formik.errors.duration}
                  errorText={formik.errors.duration as string}
                >
                  <NumInput
                    inputValue={formik.values.duration}
                    onChange={(inputValue) => {
                      formik.setFieldValue("duration", inputValue);
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

interface DataProps {
  routeTitle: string;
}

const Data = (props: DataProps) => {
  // Props
  const { routeTitle } = props;

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
    dummyData: DUMMY_TIME_RULE,
    // TODO_DEV fetch data url
    url: ``,
  });

  // Derived Values
  const dataConfig: DataConfig = {
    headers: [
      {
        th: "Name",
        sortable: true,
      },
      {
        th: "Duration",
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
            value: item.duration,
            td: `${formatDuration(item.duration, t)}`,
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
    ] as RowOptionsTableOptionGenerator<DataInterface>[],
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

  // States
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname);
  const routeTitle =
    last(activeNav)?.label || pluckString(t, last(activeNav)?.labelKey || "");

  return (
    <View.Content p={GAP}>
      <CContainer flex={1} overflowY={"auto"}>
        <View.Header
          withTitle
          ViewTitleProps={{
            ml: [2, null, 0],
          }}
          justify={"space-between"}
        ></View.Header>

        <Item.Body flex={1} overflowY={"auto"}>
          <Data routeTitle={routeTitle} />
        </Item.Body>
      </CContainer>
    </View.Content>
  );
}
