import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from './layout/DashboardLayout';
import { OverviewPage } from './pages/OverviewPage';
import { JourneyPolicyPage } from './pages/JourneyPolicyPage';
import { SalesUpsellPage } from './pages/SalesUpsellPage';
import { FriendlinessPage } from './pages/FriendlinessPage';
import { AlertsCoachingPage } from './pages/AlertsCoachingPage';
import { ExploreComparePage } from './pages/ExploreComparePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <OverviewPage /> },
      { path: '/overview', element: <OverviewPage /> },
      { path: '/journey-policy', element: <JourneyPolicyPage /> },
      { path: '/sales-upsell', element: <SalesUpsellPage /> },
      { path: '/friendliness', element: <FriendlinessPage /> },
      { path: '/alerts-coaching', element: <AlertsCoachingPage /> },
      { path: '/explore-compare', element: <ExploreComparePage /> },
    ],
  },
]);

