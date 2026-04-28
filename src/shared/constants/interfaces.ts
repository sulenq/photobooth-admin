import { BtnProps } from "@/components/ui/btn";
import { ActivityActionEnum } from "@/shared/constants/enums";
import { Gender } from "@/shared/constants/types";
import { MenuItemProps, StackProps } from "@chakra-ui/react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// Auth
export interface Interface__ActivityLog extends CUD {
  id: string;
  userId: string;
  action: ActivityActionEnum | string;
  metadata?: Record<string, any>;
  user?: Interface__User;
}
export interface Interface__AuthLog extends CUD {
  id: string;
  ip: string;
  city: string;
  countryCode: string;
  userAgent: string;
  action: string; // "Sign in" | "Sign out" ;
}
export interface Interface__User extends CUD {
  id: string;
  avatar: Interface__StorageFile[];
  name: string;
  email: string;
  role: Role;
  accountStatus: string;
  // optional
  username?: string | null;
  gender: Gender | null;
  phoneNumber: string | null;
  birthDate: string | null;
  address: string | null;
  // audit timestamps
  lastLoginAt: string | null;
  lastChangePasswordAt: string | null;
  deactiveAt: string | null;

  // additional
  taskCount?: number;
}
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Navs
export interface Interface__NavGroup {
  labelKey?: string;
  label?: string;
  navs: Interface__Nav[];
}
export interface Interface__Nav {
  icon?: LucideIcon;
  labelKey?: string;
  label?: string;
  path: string;
  backPath?: string;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  children?: Interface__NavGroup[];
  childrenInvisible?: boolean;
}

// Pdf Viewer
export interface Interface__PdfViewer {
  pageWidth: number;
  numPages: number | null;
  page: number;
  scale: number;
  mode: "single" | "scroll";
}
export interface Interface__PdfViewerUtils {
  setPageWidth: (width: number) => void;
  setPage: (p: number) => void;
  prevPage: () => void;
  nextPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  handleDownload: () => void;
  toggleMode: () => void;
}

// Data Table
export interface DataConfig {
  headers?: FormattedTableHeader[];
  rows?: FormattedTableRow[];
  rowOptions?: RowOptionsTableOptionGenerator[];
  batchOptions?: BatchOptionsTableOptionGenerator[];
}
export interface FormattedTableHeader {
  th: string;
  sortable?: boolean;
  headerProps?: StackProps;
  wrapperProps?: StackProps;
  align?: string;
}
export interface FormattedTableRow<T = any> {
  id: string;
  idx: number;
  data: T;
  dim?: boolean;
  columns: {
    td: any;
    value: any;
    dataType?: string; // "string" | "number" | "date" | "time" |
    bodyProps?: StackProps;
    wrapperProps?: StackProps;
    align?: string;
    dim?: boolean;
  }[];
}
export interface Interface__TableOption {
  disabled?: boolean;
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  confirmation?: {
    id: string;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    confirmButtonProps?: BtnProps;
    loading?: boolean;
    disabled?: boolean;
  };
  menuItemProps?: Partial<MenuItemProps>;
  override?: ReactNode;
}
export type RowOptionsTableOptionGenerator<T = any> = (
  formattedRow: FormattedTableRow<T>,
  overloads?: any,
) => Interface__TableOption | null | false;
export type BatchOptionsTableOptionGenerator<T = string[]> = (
  selectedRowIds: T,
  overloads?: any,
) => Interface__TableOption | null | false;

// HTTP
export interface Interface__RequestState<T = any> {
  loading: boolean;
  status: number | null;
  error: any;
  response: AxiosResponse<T> | null;
}
export interface Interface__Req<T = any> {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<T>) => void;
    onError?: (e: any) => void;
  };
}

// Storage
export interface Interface__StorageFile extends CUD {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  fileMimeType: string;
  fileSize: string;
}

// Select Input
export interface Interface__SelectOption {
  id: any;
  label: any;
  label2?: any;
  original_data?: any;
  disabled?: boolean;
}

// CUD
export interface CUD {
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

// -----------------------------------------------------------------

// Main Feature ----------------------------------------------------

// Product
export interface Product extends CUD {
  id: string;
  code: string;
  name: string;
  tenantId: string;
  price: number;
  imagePath: string;
}

// Template
export interface Template extends CUD {
  id: string;
  name: string;
  type: string;
  imagePath: string;
}

// Time Rule
export interface TimeRule extends CUD {
  id: string;
  name: string;
  duration: number;
}

// Voucher
export interface Voucher extends CUD {
  id: string;
  name: string;
  value: string;
  isPercentage: boolean;
  isLimit: boolean;
  limitQty: number | null;
  limitRp: number | null;
  dateFrom: string | null;
  dateTo: string | null;
  tenantId: string;
  used: number;
}

// Transaction
export interface Transaction extends CUD {
  id: string;
  invoiceNumber: string;
  productCode: string;
  productName: string;
  price: number;
  qty: number;
  voucherCode: string;
  voucherPrice: number;
  grandTotal: number;
  tenantId: string;
  transactionDate: string;
  status: string;
}
