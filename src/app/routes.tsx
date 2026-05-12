import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ControlPanel } from './components/ControlPanel';
import { AdvancedSearch } from './components/AdvancedSearch';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'control-panel', Component: ControlPanel },
      { path: 'advanced-search', Component: AdvancedSearch },
    ],
  },
]);
