// @flow
import * as React from 'react';
import classnames from 'classnames';
import { BusyMessage } from 'component/common';
import Button from 'component/link';
import NavElements from './internal/nav-elements';
import Header from './internal/header';

type NavLink = {
  label: string,
  path: string,
  active: boolean,
  subLinks?: Array<NavLink>
}

type NavLinks = {
  primary: Array<NavLink>,
  secondary: Array<NavLink>
}

type Props = {
  children: React.Node,
  title: ?string,
  noPadding: ?boolean,
  isLoading: ?boolean,
  back: () => void,
  forward: () => void,
  isBackDisabled: boolean,
  isForwardDisabled: boolean,
  navigate: (string, ?{}) => void,
  balance: string,
  downloadUpgrade: any => void,
  isUpgradeAvailable: boolean,
  navLinks: NavLinks
};

const Page = (props: Props) => {
  const {
    children,
    title,
    noPadding,
    isLoading,
    back,
    forward,
    isBackDisabled,
    isForwardDisabled,
    navigate,
    balance,
    downloadUpgrade,
    isUpgradeAvailable,
    navLinks
  } = props;
  return (
    <main className="page">
      <NavElements
        title={title}
        navigate={navigate}
        back={back}
        isBackDisabled={isBackDisabled}
        forward={forward}
        isForwardDisabled={isForwardDisabled}
        navLinks={navLinks}
      />
      <Header
        navigate={navigate}
        balance={balance}
        downloadUpgrade={downloadUpgrade}
        isUpgradeAvailable={isUpgradeAvailable}
      />
      <div className="content">
        <div className="page__header">
          {title && <h1 className="page__title">{title}</h1>}
          {isLoading && <BusyMessage message={__('Fetching content')} />}
        </div>
        <div className={classnames('main', { 'main--no-padding': noPadding })}>{children}</div>
      </div>
    </main>
  );
};

export default Page;
