import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getSubscribersCsv, getUnsubscribersCsv, getCombinedCsv } from 'soapbox/actions/email-list';
import List, { ListItem } from 'soapbox/components/list';
import { CardTitle, IconButton, Stack } from 'soapbox/components/ui';
import { useAppDispatch, useOwnAccount, useFeatures, useInstance } from 'soapbox/hooks';
import sourceCode from 'soapbox/utils/code';
import { download } from 'soapbox/utils/download';
import { parseVersion } from 'soapbox/utils/features';

import { DashCounter, DashCounters } from '../components/dashcounter';
import RegistrationModePicker from '../components/registration-mode-picker';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const instance = useInstance();
  const features = useFeatures();
  const account = useOwnAccount();

  const handleSubscribersClick: React.MouseEventHandler = e => {
    dispatch(getSubscribersCsv()).then((response) => {
      download(response, 'subscribers.csv');
    }).catch(() => {});
    e.preventDefault();
  };

  const handleUnsubscribersClick: React.MouseEventHandler = e => {
    dispatch(getUnsubscribersCsv()).then((response) => {
      download(response, 'unsubscribers.csv');
    }).catch(() => {});
    e.preventDefault();
  };

  const handleCombinedClick: React.MouseEventHandler = e => {
    dispatch(getCombinedCsv()).then((response) => {
      download(response, 'combined.csv');
    }).catch(() => {});
    e.preventDefault();
  };

  const v = parseVersion(instance.version);

  const userCount   = instance.stats.get('user_count');
  const statusCount = instance.stats.get('status_count');
  const domainCount = instance.stats.get('domain_count');

  const mau = instance.pleroma.getIn(['stats', 'mau']) as number | undefined;
  const retention = (userCount && mau) ? Math.round(mau / userCount * 100) : undefined;

  if (!account) return null;

  return (
    <Stack space={6} className='mt-4'>
      <DashCounters>
        <DashCounter
          count={mau}
          label={<FormattedMessage id='admin.dashcounters.mau_label' defaultMessage='monthly active users' />}
        />
        <DashCounter
          to='/soapbox/admin/users'
          count={userCount}
          label={<FormattedMessage id='admin.dashcounters.user_count_label' defaultMessage='total users' />}
        />
        <DashCounter
          count={retention}
          label={<FormattedMessage id='admin.dashcounters.retention_label' defaultMessage='user retention' />}
          percent
        />
        <DashCounter
          to='/timeline/local'
          count={statusCount}
          label={<FormattedMessage id='admin.dashcounters.status_count_label' defaultMessage='posts' />}
        />
        <DashCounter
          count={domainCount}
          label={<FormattedMessage id='admin.dashcounters.domain_count_label' defaultMessage='peers' />}
        />
      </DashCounters>

      {account.admin && <RegistrationModePicker />}

      <CardTitle
        title={<FormattedMessage id='admin.dashwidgets.software_header' defaultMessage='Software' />}
      />

      <List>
        <ListItem label={<FormattedMessage id='admin.software.frontend' defaultMessage='Frontend' />}>
          <span>{sourceCode.displayName} {sourceCode.version}</span>
        </ListItem>

        <ListItem label={<FormattedMessage id='admin.software.backend' defaultMessage='Backend' />}>
          <span>{v.software + (v.build ? `+${v.build}` : '')} {v.version}</span>
        </ListItem>
      </List>

      {(features.emailList && account.admin) && (
        <>
          <CardTitle
            title={<FormattedMessage id='admin.dashwidgets.email_list_header' defaultMessage='Email list' />}
          />

          <List>
            <ListItem label='subscribers.csv'>
              <IconButton
                src={require('@tabler/icons/download.svg')}
                onClick={handleSubscribersClick}
                iconClassName='w-5 h-5'
              />
            </ListItem>

            <ListItem label='unsubscribers.csv'>
              <IconButton
                src={require('@tabler/icons/download.svg')}
                onClick={handleUnsubscribersClick}
                iconClassName='w-5 h-5'
              />
            </ListItem>

            <ListItem label='combined.csv'>
              <IconButton
                src={require('@tabler/icons/download.svg')}
                onClick={handleCombinedClick}
                iconClassName='w-5 h-5'
              />
            </ListItem>
          </List>
        </>
      )}
    </Stack>
  );
};

export default Dashboard;
