import { Gender } from "@/shared/constants/types";
import {
  Interface__User,
  Product,
  Role,
  Template,
  Tenant,
  TimeRule,
  Transaction,
  Voucher,
} from "./interfaces";
const generate1D = () => {
  let v23 = 80;
  let v24 = 90;
  let v25 = 100;

  return Array.from({ length: 366 }, (_, i) => {
    v23 += Math.floor(Math.random() * 7 - 3);
    v24 += Math.floor(Math.random() * 7 - 3);
    v25 += Math.floor(Math.random() * 7 - 3);

    v23 = Math.max(20, Math.min(160, v23));
    v24 = Math.max(20, Math.min(160, v24));
    v25 = Math.max(20, Math.min(160, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      day: i + 1,
    };
  });
};
const generate1W = () => {
  let v23 = 90;
  let v24 = 100;
  let v25 = 110;

  return Array.from({ length: 52 }, (_, i) => {
    v23 += Math.floor(Math.random() * 9 - 4);
    v24 += Math.floor(Math.random() * 9 - 4);
    v25 += Math.floor(Math.random() * 9 - 4);

    v23 = Math.max(30, Math.min(180, v23));
    v24 = Math.max(30, Math.min(180, v24));
    v25 = Math.max(30, Math.min(180, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      week: i + 1,
    };
  });
};
const generate1M = () => {
  let v23 = 90;
  let v24 = 100;
  let v25 = 110;

  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month) => {
    v23 += Math.floor(Math.random() * 5 - 2);
    v24 += Math.floor(Math.random() * 5 - 2);
    v25 += Math.floor(Math.random() * 5 - 2);

    v23 = Math.max(60, Math.min(140, v23));
    v24 = Math.max(60, Math.min(140, v24));
    v25 = Math.max(60, Math.min(140, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      month,
    };
  });
};
const generate3M = () => {
  let v23 = 95;
  let v24 = 105;
  let v25 = 115;

  return ["January", "April", "July", "October"].map((month) => {
    v23 += Math.floor(Math.random() * 3 - 1);
    v24 += Math.floor(Math.random() * 3 - 1);
    v25 += Math.floor(Math.random() * 3 - 1);

    v23 = Math.max(80, Math.min(130, v23));
    v24 = Math.max(80, Math.min(130, v24));
    v25 = Math.max(80, Math.min(130, v25));

    return {
      2023: v23,
      2024: v24,
      2025: v25,
      month,
    };
  });
};

export const DUMMY_CHART_DATA = {
  "1D": generate1D(),

  "1W": generate1W(),

  "1M": generate1M(),

  "3M": generate3M(),
};
export const DUMMY_DASHBOARD_DATA = {
  overview: {
    totalUsers: 1284,
    totalDocument: 356,
    totalQueryThisDay: 742,
    totalDOcumentCompared: 189,
    AnswerSuccessRate: 0.94,
    AvgResponseTime: 1820,
  },
  usage: DUMMY_CHART_DATA,
  modelPerformance: {},
  comparison: {},
};
export const DUMMY_USER = {
  id: "1",
  avatar: [
    {
      id: "10",
      fileName: "profile_rani_kartika.jpg",
      filePath: "/uploads/profile/profile_rani_kartika.jpg",
      fileUrl: "https://i.pravatar.cc/300?img=12",
      fileMimeType: "image/jpeg",
      fileSize: "245320",
      createdBy: "system",
      updatedBy: "system",
      createdAt: "2023-03-10T08:42:00Z",
      updatedAt: "2025-11-12T04:20:00Z",
    },
  ],
  name: "Sulenq Wazawsky",
  email: "sulengpol@gmail.com",
  role: {
    id: "3",
    name: "HR Manager",
    description:
      "Responsible for managing employee data, policies, and approvals",
    permissions: [
      "employee.read",
      "employee.write",
      "attendance.validate",
      "leave.approve",
      "role.manage",
    ],
    createdBy: "system",
    updatedBy: "system",
    createdAt: "2023-03-10T08:42:00Z",
    updatedAt: "2025-11-12T04:20:00Z",
    deletedAt: null,
  },
  accountStatus: "active",
  gender: "FEMALE" as Gender,
  phoneNumber: "+6281234567890",
  birthDate: "1985-07-12",
  address: "Jl. Melati No. 12, Jakarta Selatan",
  registeredAt: "2023-03-10T08:42:00Z",
  lastLoginAt: "2025-11-12T04:20:00Z",
  lastChangePasswordAt: "2025-05-01T12:30:00Z",
  deactiveAt: null,
  createdBy: "system",
  updatedBy: "system",
  createdAt: "2023-03-10T08:42:00Z",
  updatedAt: "2025-11-12T04:20:00Z",

  taskCount: 10,
};

export const dummyUsers: Interface__User[] = [
  {
    id: "101",
    avatar: [
      {
        id: "SF001",
        fileName: "Putri_avatar.svg",
        filePath: "/users/101/avatars/",
        fileUrl:
          "https://ui-avatars.com/api/?name=Putri+Setiawan&background=random",
        fileMimeType: "image/svg+xml",
        fileSize: "4551",
        createdAt: "2024-01-01T08:00:00.000Z",
        updatedAt: "2024-01-01T08:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Putri Setiawan",
    email: "putri.setiawan1@example.com",
    role: {
      id: "R001",
      name: "ADMIN",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: "FEMALE",
    phoneNumber: "+6281398128384",
    birthDate: "1997-01-13",
    address: "Jl. Pahlawan No. 1, Bandung",
    lastLoginAt: "2026-03-05T12:32:44.539Z",
    lastChangePasswordAt: "2025-10-19T09:28:16.702Z",
    deactiveAt: null,
    createdAt: "2025-04-11T17:21:28.805Z",
    updatedAt: "2026-02-17T00:44:50.516Z",
    deletedAt: null,
  },
  {
    id: "102",
    avatar: [
      {
        id: "SF002",
        fileName: "Putri_avatar.svg",
        filePath: "/users/102/avatars/",
        fileUrl:
          "https://ui-avatars.com/api/?name=Putri+Mulyani&background=random",
        fileMimeType: "image/svg+xml",
        fileSize: "5070",
        createdAt: "2024-01-01T08:00:00.000Z",
        updatedAt: "2024-01-01T08:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Putri Mulyani",
    email: "putri.mulyani2@example.com",
    role: {
      id: "R001",
      name: "ADMIN",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: "FEMALE",
    phoneNumber: "+6281160538449",
    birthDate: "1993-01-16",
    address: "Jl. Pahlawan No. 2, Malang",
    lastLoginAt: "2026-01-20T06:25:46.454Z",
    lastChangePasswordAt: null,
    deactiveAt: null,
    createdAt: "2025-12-17T15:21:39.726Z",
    updatedAt: "2026-01-18T23:37:42.795Z",
    deletedAt: null,
  },
  {
    id: "103",
    avatar: [
      {
        id: "SF003",
        fileName: "Lestari_avatar.svg",
        filePath: "/users/103/avatars/",
        fileUrl:
          "https://ui-avatars.com/api/?name=Lestari+Mulyani&background=random",
        fileMimeType: "image/svg+xml",
        fileSize: "5463",
        createdAt: "2024-01-01T08:00:00.000Z",
        updatedAt: "2024-01-01T08:00:00.000Z",
        deletedAt: null,
      },
    ],
    name: "Lestari Mulyani",
    email: "lestari.mulyani3@example.com",
    role: {
      id: "R003",
      name: "VIEWER",
      createdAt: "2023-05-01T00:00:00.000Z",
      updatedAt: "2025-05-01T00:00:00.000Z",
      deletedAt: null,
    },
    accountStatus: "active",
    gender: "FEMALE",
    phoneNumber: "+6281769133411",
    birthDate: "1998-05-10",
    address: "Jl. Pahlawan No. 3, Yogyakarta",
    lastLoginAt: "2026-03-02T01:15:30.397Z",
    lastChangePasswordAt: null,
    deactiveAt: null,
    createdAt: "2025-11-26T09:23:14.671Z",
    updatedAt: "2026-01-11T20:18:45.532Z",
    deletedAt: null,
  },
];

export const dummyAuthLogs = [
  {
    id: "sh_001",
    action: "Sign out",
    ip: "192.168.1.10",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    createdAt: "2025-11-14T03:20:00.000Z",
    updatedAt: "2025-11-14T03:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_002",
    action: "Sign in",
    ip: "10.0.0.5",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5)",
    createdAt: "2025-11-13T10:45:00.000Z",
    updatedAt: "2025-11-13T10:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_003",
    action: "Sign in",
    ip: "36.72.11.88",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1)",
    createdAt: "2025-11-10T21:12:00.000Z",
    updatedAt: "2025-11-11T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_004",
    action: "Sign out",
    ip: "172.16.0.22",
    city: "Jakarta",
    countryCode: "ID",
    userAgent: "Mozilla/5.0 (Linux; Android 14)",
    createdAt: "2025-11-09T14:30:00.000Z",
    updatedAt: "2025-11-09T14:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "sh_005",
    action: "Sign in",
    ip: "103.110.7.51",
    city: "Jakarta",
    countryCode: "ID",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; rv:144.0) Gecko/20100101 Firefox/144.0",
    createdAt: "2025-11-08T08:12:00.000Z",
    updatedAt: "2025-11-08T08:12:00.000Z",
    deletedAt: null,
  },
];

export const dummyActivityLogs = [
  {
    id: "1",
    userId: "101",
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "101",
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "101",
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "101",
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];

export const dummyAllActivityLogs = [
  {
    id: "1",
    userId: "103",
    user: dummyUsers[2],
    action: "DELETE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:45:00.000Z",
    updatedAt: "2025-11-12T18:45:00.000Z",
    deletedAt: null,
  },
  {
    id: "2",
    userId: "101",
    user: dummyUsers[0],
    action: "CREATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-14T01:15:00.000Z",
    updatedAt: "2025-11-14T01:15:00.000Z",
    deletedAt: null,
  },
  {
    id: "3",
    userId: "102",
    user: dummyUsers[1],
    action: "UPDATE_WORKSPACE",
    metadata: { workspaceName: "Project Alpha" },
    createdAt: "2025-11-13T10:20:00.000Z",
    updatedAt: "2025-11-13T10:20:00.000Z",
    deletedAt: null,
  },
  {
    id: "4",
    userId: "104",
    user: dummyUsers[3],
    action: "CREATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-13T09:05:00.000Z",
    updatedAt: "2025-11-13T09:05:00.000Z",
    deletedAt: null,
  },
  {
    id: "5",
    userId: "105",
    user: dummyUsers[4],
    action: "UPDATE_LAYER",
    metadata: { layerName: "Boundary Layer" },
    createdAt: "2025-11-12T18:30:00.000Z",
    updatedAt: "2025-11-12T18:30:00.000Z",
    deletedAt: null,
  },
];

// -----------------------------------------------------------------

export const DUMMY_PERMISSIONS: Role[] = [
  {
    id: "1",
    name: "tenant.create",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
  {
    id: "2",
    name: "tenant.delete",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
];

export const DUMMY_ROLES: Role[] = [
  {
    id: "1",
    name: "Tenant",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
  {
    id: "2",
    name: "Admin",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
];

export const DUMMY_TENANTS: Tenant[] = [
  {
    id: "1",
    name: "PT Nusantara Sejahtera",
    address: "Jl. Sudirman No. 10, Jakarta",
    tenantCode: "TNT-001",
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: "2",
    name: "CV Maju Jaya",
    address: "Jl. Diponegoro No. 25, Bandung",
    tenantCode: "TNT-002",
    createdAt: "2026-01-05T09:30:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
    deletedAt: null,
  },
  {
    id: "3",
    name: "PT Sinar Abadi",
    address: "Jl. Ahmad Yani No. 50, Surabaya",
    tenantCode: "TNT-003",
    createdAt: "2026-01-10T07:45:00Z",
    updatedAt: null,
    deletedAt: "2026-03-01T12:00:00Z",
  },
];

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    code: "PRD-001",
    name: "Wireless Mouse",
    tenantId: "TNT-001",
    price: 150000,
    imagePath: "/images/products/mouse.jpg",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    code: "PRD-002",
    name: "Mechanical Keyboard",
    tenantId: "TNT-001",
    price: 450000,
    imagePath: "/images/products/keyboard.jpg",
    createdAt: "2026-01-05T12:30:00.000Z",
  },
  {
    id: "3",
    code: "PRD-003",
    name: "USB-C Hub",
    tenantId: "TNT-002",
    price: 250000,
    imagePath: "/images/products/hub.jpg",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
];

export const DUMMY_TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Template A",
    type: "A",
    imagePath: "/images/templates/template-a.jpg",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    name: "Template B",
    type: "B",
    imagePath: "/images/templates/template-b.jpg",
    createdAt: "2026-01-05T12:30:00.000Z",
  },
  {
    id: "3",
    name: "Template C",
    type: "C",
    imagePath: "/images/templates/template-c.jpg",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
];

export const DUMMY_TIME_RULE: TimeRule[] = [
  {
    id: "1",
    name: "QRIS Timeout",
    duration: 1000,
    createdAt: "2026-01-10T08:15:00.000Z",
  },
  {
    id: "2",
    name: "Photo Session",
    duration: 1000,
    createdAt: "2026-01-10T08:15:00.000Z",
  },
];

export const DUMMY_VOUCHER: Voucher[] = [
  {
    id: "1",
    name: "Voucher Diskon 10%",
    value: "10",
    isPercentage: true,
    isLimit: false,
    limitQty: null,
    limitRp: null,
    dateFrom: "2026-01-01T00:00:00.000Z",
    dateTo: "2026-12-31T23:59:59.000Z",
    tenantId: "TNT-001",
    createdAt: "2026-01-01T10:00:00.000Z",
    used: 24,
  },
  {
    id: "2",
    name: "Voucher Potongan 50K",
    value: "50000",
    isPercentage: false,
    isLimit: true,
    limitQty: 100,
    limitRp: null,
    dateFrom: "2026-02-01T00:00:00.000Z",
    dateTo: "2026-06-30T23:59:59.000Z",
    tenantId: "TNT-001",
    createdAt: "2026-02-01T09:00:00.000Z",
    used: 0,
  },
  {
    id: "3",
    name: "Voucher Cashback 20%",
    value: "20",
    isPercentage: true,
    isLimit: true,
    limitQty: null,
    limitRp: 100000,
    dateFrom: null,
    dateTo: null,
    tenantId: "TNT-002",
    createdAt: "2026-03-10T08:30:00.000Z",
    used: 15,
  },
];

export const DUMMY_TRANSACTION: Transaction[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    productCode: "PRD-001",
    productName: "Wireless Mouse",
    price: 150000,
    qty: 2,
    voucherCode: "DISC10",
    voucherPrice: 30000,
    grandTotal: 270000,
    tenantId: "TNT-001",
    transactionDate: "2026-01-01T10:00:00.000Z",
    status: "SUCCESS",
    createdAt: "2026-01-01T10:00:00.000Z",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    productCode: "PRD-002",
    productName: "Mechanical Keyboard",
    price: 450000,
    qty: 1,
    voucherCode: "",
    voucherPrice: 0,
    grandTotal: 450000,
    tenantId: "TNT-001",
    transactionDate: "2026-01-05T12:30:00.000Z",
    status: "PENDING",
    createdAt: "2026-01-05T12:30:00.000Z",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    productCode: "PRD-003",
    productName: "USB-C Hub",
    price: 250000,
    qty: 3,
    voucherCode: "CASHBACK20",
    voucherPrice: 150000,
    grandTotal: 600000,
    tenantId: "TNT-002",
    transactionDate: "2026-01-10T08:15:00.000Z",
    status: "FAILED",
    createdAt: "2026-01-10T08:15:00.000Z",
  },
];
