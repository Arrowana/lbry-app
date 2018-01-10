// @flow
import React from 'react';
import Button from 'component/link';
import WunderBar from 'component/wunderbar';

type Props = {
  balance: string,
  navigate: any => void,
  downloadUpgrade: any => void,
  isUpgradeAvailable: boolean,
};

const Header = (props: Props) => {
  const { balance, isUpgradeAvailable, navigate, downloadUpgrade } = props;
  return (
    <header className="header">
      <WunderBar />

      <div className="header__actions-right">
        <Button
          inverse
          onClick={() => navigate('/wallet')}
          icon="user"
          label={isUpgradeAvailable ? `${balance} LBC` : `You have ${balance} LBC`}
          description={__('Your wallet')}
        />

        <Button
          onClick={() => navigate('/publish')}
          icon="cloud-upload"
          label={isUpgradeAvailable ? '' : __('Publish')}
          description={__('Publish content')}
        />

        {isUpgradeAvailable && (
          <Button onClick={() => downloadUpgrade()} icon="arrow-up" label={__('Upgrade App')} />
        )}
      </div>
    </header>
  );
};

export default Header;
