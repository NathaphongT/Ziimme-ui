import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'customer',
    title: 'ข้อมูลลูกค้า',
    type: 'group',

    children: [
      {
        icon: 'feather icon-users',
        id: 'customers-list',
        title: 'ข้อมูลลูกค้า',
        type: 'item',
        url: 'customer/list',
        classes: 'nav-item',
      },
      {
        icon: 'feather icon-calendar',
        id: 'customers-birthday',
        title: 'ข้อมูลวันเกิด',
        type: 'item',
        url: 'customer/birthday',
        classes: 'nav-item',
      },
    ],
  },
  {
    id: 'employee',
    title: 'ข้อมูลพนักงาน',
    type: 'group',
    children: [
      {
        icon: 'feather icon-user',
        id: 'employees-list',
        title: 'ข้อมูลพนักงาน',
        type: 'item',
        url: 'employee/list',
        classes: 'nav-item',
      },
      {
        icon: 'feather icon-activity',
        id: 'employees-total-sale',
        title: 'ข้อมูลยอดขายรวม',
        type: 'item',
        url: 'employee/total-sale',
        classes: 'nav-item',
      },
      {
        icon: 'feather icon-award',
        id: 'employees-total-sale',
        title: 'ข้อมูลโปรโมชั่น',
        type: 'item',
        url: 'employee/promotiom-sale',
        classes: 'nav-item',
      },
    ],
  },
  {
    id: 'basic',
    title: 'ข้อมูลพื้นฐาน',
    type: 'group',
    children: [
      {
        icon: 'feather icon-book',
        id: 'basics',
        title: 'จัดการข้อมูลคอร์ส',
        type: 'item',
        url: '/basic/course',
        classes: 'nav-item',
      },
      {
        icon: 'feather icon-user-plus',
        id: 'basics',
        title: 'จัดการข้อมูลตำแหน่ง',
        type: 'item',
        url: '/basic/position',
        classes: 'nav-item',
      },
      {
        icon: 'feather icon-globe',
        id: 'basics',
        title: 'จัดการข้อมูลสาขา',
        type: 'item',
        url: '/basic/branch',
        classes: 'nav-item',
      },
      {
        icon: 'feather icon-lock',
        id: 'basics',
        title: 'จัดการข้อมูลผู้ใช้งาน',
        type: 'item',
        url: '/basic/user',
        classes: 'nav-item',
      }
    ],
  },
  {
    id: 'logout',
    title: 'ออกจากระบบ',
    type: 'item',
    url: '/sign-out',
    icon: 'feather icon-log-out',
  },

  // {
  //   id: 'ui-element',
  //   title: 'UI ELEMENT',
  //   type: 'group',
  //   icon: 'icon-ui',
  //   children: [
  //     {
  //       id: 'basic',
  //       title: 'Component',
  //       type: 'collapse',
  //       icon: 'feather icon-box',
  //       children: [
  //         {
  //           id: 'button',
  //           title: 'Button',
  //           type: 'item',
  //           url: '/basic/button',
  //         },
  //         {
  //           id: 'badges',
  //           title: 'Badges',
  //           type: 'item',
  //           url: '/basic/badges',
  //         },
  //         {
  //           id: 'breadcrumb-pagination',
  //           title: 'Breadcrumb & Pagination',
  //           type: 'item',
  //           url: '/basic/breadcrumb-paging',
  //         },
  //         {
  //           id: 'collapse',
  //           title: 'Collapse',
  //           type: 'item',
  //           url: '/basic/collapse',
  //         },
  //         {
  //           id: 'tabs-pills',
  //           title: 'Tabs & Pills',
  //           type: 'item',
  //           url: '/basic/tabs-pills',
  //         },
  //         {
  //           id: 'typography',
  //           title: 'Typography',
  //           type: 'item',
  //           url: '/basic/typography',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: 'forms',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms-element',
  //       title: 'Form Elements',
  //       type: 'item',
  //       url: '/forms/basic',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text',
  //     },
  //     {
  //       id: 'tables',
  //       title: 'Tables',
  //       type: 'item',
  //       url: '/tables/bootstrap',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server',
  //     },
  //   ],
  // },
  // {
  //   id: 'chart-maps',
  //   title: 'Chart & Maps',
  //   type: 'group',
  //   icon: 'icon-charts',
  //   children: [
  //     {
  //       id: 'charts',
  //       title: 'Charts',
  //       type: 'item',
  //       url: '/charts/morris',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart',
  //     },
  //   ],
  // },
  // {
  //   id: 'pages',
  //   title: 'Pages',
  //   type: 'group',
  //   icon: 'icon-pages',
  //   children: [
  //     {
  //       id: 'auth',
  //       title: 'Authentication',
  //       type: 'collapse',
  //       icon: 'feather icon-lock',
  //       children: [
  //         {
  //           id: 'signup',
  //           title: 'Sign up',
  //           type: 'item',
  //           url: '/auth/signup',
  //           target: true,
  //           breadcrumbs: false,
  //         },
  //         {
  //           id: 'signin',
  //           title: 'Sign in',
  //           type: 'item',
  //           url: '/auth/signin',
  //           target: true,
  //           breadcrumbs: false,
  //         },
  //       ],
  //     },
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar',
  //     },
  //     {
  //       id: 'disabled-menu',
  //       title: 'Disabled Menu',
  //       type: 'item',
  //       url: 'javascript:',
  //       classes: 'nav-item disabled',
  //       icon: 'feather icon-power',
  //       external: true,
  //     },
  //     {
  //       id: 'buy_now',
  //       title: 'Buy Now',
  //       type: 'item',
  //       icon: 'feather icon-book',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.com/item/datta-able-angular/',
  //       target: true,
  //       external: true,
  //     },
  //   ],
  // },
];



@Injectable()

export class NavigationItem {

  constructor(private router: Router, private route: ActivatedRoute) { }

  get() {
    return NavigationItems;
  }
  logout() {
    this.router.navigate(['/sign-out']);
  }
}
