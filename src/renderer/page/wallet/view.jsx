import React from 'react';
import WalletBalance from 'component/walletBalance';
import RewardSummary from 'component/rewardSummary';
import TransactionListRecent from 'component/transactionListRecent';
import Page from 'component/page';

const WalletPage = props => (
  <Page>
    <WalletBalance />
    <RewardSummary />
    <TransactionListRecent />
  </Page>
);

export default WalletPage;
