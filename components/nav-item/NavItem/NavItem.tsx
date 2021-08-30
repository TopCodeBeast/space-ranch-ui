import cn from 'classnames';
import Link from 'next/link';
import React, { HTMLAttributes, ReactNode } from 'react';

import { Badge } from 'components/badge/Badge';
import { Icon, IconName } from 'components/Icon';

// eslint-disable-next-line no-restricted-imports
import { useIsActive } from '../navHooks';

import styles from './NavItem.module.scss';

interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  label: string | ReactNode;
  href?: string;
  icon: IconName;
  count?: number;
  active?: boolean;
  className?: string;
  topDelimiter?: boolean;
  bottomDelimiter?: boolean;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  href,
  count,
  active,
  className,
  topDelimiter,
  bottomDelimiter,
  onClick,
  ...props
}) => {
  const isActive = useIsActive(href);

  const rootClassName = cn(styles.nav, className, {
    [styles.active]: active || isActive,
    [styles.topDelimiter]: topDelimiter,
    [styles.bottomDelimiter]: bottomDelimiter
  });

  function handleOnClick() {
    if (onClick) {
      onClick();
    }
  }

  function renderContent() {
    return (
      <>
        <Icon height={16} name={icon} />
        <span> {label} </span>
        {Number.isFinite(count) && (
          <Badge className={styles.badge} variant="primary" size="small">
            {count && count > 99 ? '99+' : count}
          </Badge>
        )}
      </>
    );
  }

  if (href) {
    return (
      <Link href={href} passHref>
        {/* TODO Property 'href' would be overridden by Link. Check https://git.io/Jns2B */}
        <a
          {...props}
          href="*"
          onClick={handleOnClick}
          className={rootClassName}
        >
          {renderContent()}
        </a>
      </Link>
    );
  }

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={handleOnClick}
      onKeyPress={handleOnClick}
      className={rootClassName}
    >
      {renderContent()}
    </div>
  );
};