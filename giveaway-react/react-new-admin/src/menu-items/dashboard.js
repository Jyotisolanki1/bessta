// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  IconDashboard,
  IconUserCheck,
  IconBuildingStore,
  IconCertificate2,
  IconBulb,
  IconTicket,
  IconCalendarEvent,
  IconShoppingCart,
  IconFileSettings,
  IconHelpCircle,
  IconHeartHandshake,
  IconList,
  IconCategoryPlus,
  IconTrophy,
  IconMail,
  IconAlarmMinus
} from '@tabler/icons-react';
// import { useSelector } from 'store';

const icons = {
  IconDashboard,
  IconUserCheck,
  IconBuildingStore,
  IconCertificate2,
  IconBulb,
  IconTicket,
  IconCalendarEvent,
  IconShoppingCart,
  IconFileSettings,
  IconHelpCircle,
  IconHeartHandshake,
  IconList,
  IconCategoryPlus,
  IconTrophy
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

// Define different dashboard configurations based on roles
const adminDashboard = {
  id: 'dashboard',
  title: '',
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'Dashboard',
      type: 'item',
      url: '/admin',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/admin/users',
      icon: icons.IconUserCheck,
      breadcrumbs: false
    },
    // {
    //   id: 'store',
    //   title: 'Store',
    //   type: 'collapse',
    //   icon: icons.IconBuildingStore,
    //   children: [
    //     {
    //       id: 'product-category',
    //       title: 'Product Category',
    //       type: 'item',
    //       url: '/admin/product-category',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'products',
    //       title: 'Products',
    //       type: 'item',
    //       url: '/admin/products',
    //       breadcrumbs: false
    //     },
    //     {
    //       id: 'status',
    //       title: 'Status',
    //       type: 'item',
    //       url: '/admin/store-status',
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    {
      id: 'course',
      title: 'Course',
      type: 'collapse',
      icon: icons.IconCertificate2,
      children: [
        {
          id: 'course-category',
          title: 'Course Category',
          type: 'item',
          url: '/admin/course-category',
          breadcrumbs: false
        },
        {
          id: 'courses',
          title: 'Courses',
          type: 'item',
          url: '/admin/courses',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'plan',
      title: 'Plan',
      type: 'collapse',
      icon: icons.IconBulb,
      children: [
        {
          id: 'plan-category',
          title: 'Plan Category',
          type: 'item',
          url: '/admin/plan-category',
          breadcrumbs: false
        },
        {
          id: 'plans',
          title: 'Plans',
          type: 'item',
          url: '/admin/plans',
          breadcrumbs: false
        }
      ]
    },
    // {
    //   id: 'coupons',
    //   title: 'Coupons',
    //   type: 'item',
    //   url: '/admin/coupons',
    //   icon: icons.IconTicket,
    //   breadcrumbs: false
    // },
    {
      id: 'events',
      title: 'Draws',
      type: 'item',
      url: '/admin/events',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },
    // {
    //   id: 'orders',
    //   title: 'Orders',
    //   type: 'item',
    //   url: '/admin/orders',
    //   icon: icons.IconShoppingCart,
    //   breadcrumbs: false
    // },
    {
      id: 'partner',
      title: 'Partners',
      type: 'item',
      url: '/admin/partner',
      icon: icons.IconHeartHandshake,
      breadcrumbs: false
    },
    {
      id: 'business-categories',
      title: 'Business-Categories',
      type: 'item',
      url: '/admin/business-categories',
      icon: icons.IconCategoryPlus,
      breadcrumbs: false
    },
    {
      id: 'faqs',
      title: 'FAQS',
      type: 'item',
      url: '/admin/faqs',
      icon: icons.IconList,
      breadcrumbs: false
    },
    {
      id: 'past-winners',
      title: 'Past-Winners',
      type: 'item',
      url: '/admin/past-winners',
      icon: icons.IconTrophy,
      breadcrumbs: false
    },
    {
      id: 'cms',
      title: 'CMS',
      type: 'item',
      url: '/admin/cms',
      icon: icons.IconFileSettings,
      breadcrumbs: false
    },

    {
      id: 'help-query',
      title: 'Help Center',
      type: 'item',
      url: '/admin/help-query',
      icon: icons.IconHelpCircle,
      breadcrumbs: false
    },
    {
      id: 'mail',
      title: 'Broadcast Mail',
      type: 'item',
      url: '/admin/mail',
      icon: IconMail,
      breadcrumbs: false
    },
    {
      id: 'notification',
      title: 'Broadcast Notification',
      type: 'item',
      url: '/admin/notification',
      icon: IconAlarmMinus,
      breadcrumbs: false
    }
  ]
};

// Function to get the dashboard configuration based on the role
const getDashboardConfig = (role) => {
  switch (role) {
    case 'admin':
      return adminDashboard;
    default:
      return adminDashboard; // Default to admin dashboard
  }
};

export default getDashboardConfig(localStorage.getItem('role'));
