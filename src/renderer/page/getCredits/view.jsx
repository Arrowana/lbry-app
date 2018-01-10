import React from 'react';
import Link from 'component/link';
import RewardSummary from 'component/rewardSummary';
import ShapeShift from 'component/shapeShift';
import Page from "component/page";

const GetCreditsPage = props => (
  <Page>
    <RewardSummary />
    <ShapeShift />
    <section className="card">
      <div className="card__title-primary">
        <h3>{__('From External Wallet')}</h3>
      </div>
      <div className="card__actions">
        <Link button="alt" navigate="/send" icon="icon-send" label={__('Send / Receive')} />
      </div>
    </section>
    <section className="card">
      <div className="card__title-primary">
        <h3>{__('More ways to get LBRY Credits')}</h3>
      </div>
      <div className="card__content">
        <p>
          {
            'LBRY credits can be purchased on exchanges, earned for contributions, for mining, and more.'
          }
        </p>
      </div>
      <div className="card__actions">
        <Link button="alt" href="https://lbry.io/faq/earn-credits" label={__('Read More')} />
      </div>
    </section>
  </Page>
);

export default GetCreditsPage;
