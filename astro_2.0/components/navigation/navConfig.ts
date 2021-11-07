import {
  ALL_DAOS_URL,
  ALL_FEED_URL,
  CREATE_DAO_URL,
  MY_DAOS_URL,
  MY_FEED_URL,
} from 'constants/routing';

import { NavItemProps } from './types';

export const NAV_CONFIG: NavItemProps[] = [
  {
    icon: 'aAllDaos',
    hoverIcon: 'aAllDaosHover',
    href: ALL_DAOS_URL,
    label: 'All DAOs',
  },
  {
    icon: 'aAstroFeed',
    hoverIcon: 'aAstroFeedHover',
    href: ALL_FEED_URL,
    label: 'Astro Feed',
  },
  {
    icon: 'aMyDaos',
    hoverIcon: 'aMyDaosHover',
    href: MY_DAOS_URL,
    label: '  My DAOs',
  },
  {
    icon: 'aMyFeed',
    hoverIcon: 'aMyFeedHover',
    href: MY_FEED_URL,
    label: 'My Feed',
  },
  {
    icon: 'aCreateDao',
    hoverIcon: 'aCreateDaoHover',
    href: CREATE_DAO_URL,
    label: 'Create DAO',
    authRequired: true,
  },
];