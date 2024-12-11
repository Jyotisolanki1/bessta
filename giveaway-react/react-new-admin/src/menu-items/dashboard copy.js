// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconDeviceAnalytics } from '@tabler/icons-react';

const icons = {
  IconDashboard,
  IconDeviceAnalytics
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'dashboard',
  title: <FormattedMessage id="dashboard" />,
  icon: icons.IconDashboard,
  type: 'group',
  children: [
    {
      id: 'admin',
      title: <FormattedMessage id="default" />,
      type: 'item',
      url: '/admin',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'rcompany',
      title: <FormattedMessage id="Requested Company" />,
      type: 'item',
      url: '/admin/rcompany',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'acompany',
      title: <FormattedMessage id="Company" />,
      type: 'item',
      url: '/admin/acompany',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'branch',
      title: <FormattedMessage id="Branch" />,
      type: 'item',
      url: '/company/branch',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'employee',
      title: <FormattedMessage id="Employee" />,
      type: 'item',
      url: '/company/employee',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'deparment',
      title: <FormattedMessage id="Deparment" />,
      type: 'item',
      url: '/admin/deparment',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'support',
      title: <FormattedMessage id="support" />,
      type: 'item',
      url: '/admin/support',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    },
    {
      id: 'cms',
      title: <FormattedMessage id="cms" />,
      type: 'item',
      url: '/admin/cms',
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
