import HomePage from '../pages/HomePage';
import PanelRightPage from '../pages/PanelRightPage';
import NotFoundPage from '../pages/404';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/panel-right',
    component: PanelRightPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
