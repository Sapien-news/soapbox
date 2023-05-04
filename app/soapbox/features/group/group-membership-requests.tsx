import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { useGroup, useGroupMembers, useGroupMembershipRequests } from 'soapbox/api/hooks';
import Account from 'soapbox/components/account';
import { AuthorizeRejectButtons } from 'soapbox/components/authorize-reject-buttons';
import ScrollableList from 'soapbox/components/scrollable-list';
import { Column, HStack, Spinner } from 'soapbox/components/ui';
import { GroupRoles } from 'soapbox/schemas/group-member';
import toast from 'soapbox/toast';

import ColumnForbidden from '../ui/components/column-forbidden';

import type { Account as AccountEntity } from 'soapbox/schemas';

type RouteParams = { groupId: string };

const messages = defineMessages({
  heading: { id: 'column.group_pending_requests', defaultMessage: 'Pending requests' },
  authorizeRejectFail: { id: 'group.membership_requests.fail', defaultMessage: 'Group owner or admin has already taken action on this request.' },
});

interface IMembershipRequest {
  account: AccountEntity
  onAuthorize(account: AccountEntity): Promise<unknown>
  onReject(account: AccountEntity): Promise<unknown>
}

const MembershipRequest: React.FC<IMembershipRequest> = ({ account, onAuthorize, onReject }) => {
  if (!account) return null;

  const handleAuthorize = () => onAuthorize(account);
  const handleReject = () => onReject(account);

  return (
    <HStack space={1} alignItems='center' justifyContent='between' className='p-2.5'>
      <div className='w-full'>
        <Account account={account} withRelationship={false} />
      </div>

      <AuthorizeRejectButtons
        onAuthorize={handleAuthorize}
        onReject={handleReject}
        countdown={3000}
      />
    </HStack>
  );
};

interface IGroupMembershipRequests {
  params: RouteParams
}

const GroupMembershipRequests: React.FC<IGroupMembershipRequests> = ({ params }) => {
  const id = params?.groupId;
  const intl = useIntl();

  const { group } = useGroup(id);

  const { accounts, authorize, reject, refetch, isLoading } = useGroupMembershipRequests(id);
  const { invalidate } = useGroupMembers(id, GroupRoles.USER);

  useEffect(() => {
    return () => {
      invalidate();
    };
  }, []);

  if (!group || !group.relationship || isLoading) {
    return (
      <Column label={intl.formatMessage(messages.heading)}>
        <Spinner />
      </Column>
    );
  }

  if (!group.relationship.role || !['owner', 'admin', 'moderator'].includes(group.relationship.role)) {
    return <ColumnForbidden />;
  }

  async function handleAuthorize(account: AccountEntity) {
    return authorize(account.id)
      .then(() => Promise.resolve())
      .catch(() => {
        refetch();
        toast.error(intl.formatMessage(messages.authorizeRejectFail));
        return Promise.reject();
      });
  }

  async function handleReject(account: AccountEntity) {
    return reject(account.id)
      .then(() => Promise.resolve())
      .catch(() => {
        refetch();
        toast.error(intl.formatMessage(messages.authorizeRejectFail));
        return Promise.reject();
      });
  }

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <ScrollableList
        scrollKey='group_membership_requests'
        emptyMessage={<FormattedMessage id='empty_column.group_membership_requests' defaultMessage='There are no pending membership requests for this group.' />}
      >
        {accounts.map((account) => (
          <MembershipRequest
            key={account.id}
            account={account}
            onAuthorize={handleAuthorize}
            onReject={handleReject}
          />
        ))}
      </ScrollableList>
    </Column>
  );
};

export default GroupMembershipRequests;
