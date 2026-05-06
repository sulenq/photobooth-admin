import { Interface__NavGroup } from "@/shared/constants/interfaces";
import {
  BrushIcon,
  ChartPieIcon,
  DatabaseIcon,
  ImagesIcon,
  LanguagesIcon,
  LayoutTemplateIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldHalfIcon,
  StoreIcon,
  TicketPercentIcon,
  TimerIcon,
  UserCogIcon,
  UserIcon,
  UserKeyIcon,
} from "lucide-react";

export const PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "main",
    navs: [
      {
        icon: ChartPieIcon,
        label: "Summary",
        path: `/summary`,
        allowedRoles: [],
      },
      {
        icon: ImagesIcon,
        label: "Product",
        path: `/product`,
        allowedRoles: [],
      },
      {
        icon: LayoutTemplateIcon,
        label: "Template",
        path: `/template`,
        allowedRoles: [],
      },
      {
        icon: TimerIcon,
        label: "Time Rule",
        path: `/time-rule`,
        allowedRoles: [],
      },
      {
        icon: TicketPercentIcon,
        label: "Voucher",
        path: `/voucher`,
        allowedRoles: [],
      },
      {
        icon: ScrollTextIcon,
        label: "Transaction",
        path: `/transaction`,
        allowedRoles: [],
      },
    ],
  },
];

export const OTHER_PRIVATE_NAV_GROUPS: Interface__NavGroup[] = [
  {
    labelKey: "other",
    navs: [
      {
        icon: DatabaseIcon,
        labelKey: "navs.master_data",
        path: `/master-data`,
        allowedRoles: [],
        children: [
          {
            label: "User",
            labelKey: "master_data_navs.hr.index",
            navs: [
              {
                icon: UserCogIcon,
                label: "User Role",
                path: `/master-data/role`,
                allowedRoles: [],
                backPath: `/master-data`,
              },
              {
                icon: UserKeyIcon,
                label: "User Permission",
                path: `/master-data/user-permission`,
                allowedRoles: [],
                backPath: `/master-data`,
              },
              {
                icon: StoreIcon,
                label: "Tenant",
                path: `/master-data/tenant`,
                allowedRoles: [],
                backPath: `/master-data`,
              },
            ],
          },
        ],
      },
      {
        icon: SettingsIcon,
        labelKey: "navs.settings",
        path: `/settings`,
        allowedRoles: [],
        children: [
          {
            labelKey: "settings_navs.main.index",
            navs: [
              {
                icon: UserIcon,
                labelKey: "my_profile",
                path: `/settings/profile`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: LanguagesIcon,
                labelKey: "settings_navs.main.regional",
                path: `/settings/regional`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: BrushIcon,
                labelKey: "settings_navs.main.personalization",
                path: `/settings/personalization`,
                allowedRoles: [],
                backPath: `/settings`,
              },
              {
                icon: ShieldHalfIcon,
                labelKey: "settings_navs.main.app_permissions",
                path: `/settings/app-permissions`,
                allowedRoles: [],
                backPath: `/settings`,
              },
            ],
          },
          // {
          //   labelKey: "settings_navs.system.index",
          //   navs: [
          //     {
          //       icon: BlocksIcon,
          //       labelKey: "settings_navs.system.integration",
          //       path: `/settings/integration`,
          //       allowedRoles: [],
          //       backPath: `/settings`,
          //     },
          //     {
          //       icon: ActivityIcon,
          //       labelKey: "settings_navs.system.activity_log",
          //       path: `/settings/activity-log`,
          //       allowedRoles: [],
          //       backPath: `/settings`,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
];

export const RESOLVED_NAVS = [
  ...PRIVATE_NAV_GROUPS,
  ...OTHER_PRIVATE_NAV_GROUPS,
];
