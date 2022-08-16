import classNames from 'classnames';
import React from 'react';

import { HStack, Stack, Text } from 'soapbox/components/ui';

import { randomIntFromInterval, generateText } from '../utils';

import PlaceholderAvatar from './placeholder_avatar';
import PlaceholderDisplayName from './placeholder_display_name';

/** Fake chat to display while data is loading. */
const PlaceholderChat = ({ isMyMessage = false }: { isMyMessage?: boolean }) => {
  const messageLength = randomIntFromInterval(160, 220);

  return (
    <Stack
      space={1}
      className={classNames({
        'max-w-[85%] animate-pulse': true,
        'ml-auto': isMyMessage,
      })}
    >
      <HStack
        alignItems='center'
        justifyContent={isMyMessage ? 'end' : 'start'}
      >
        <div
          className={
            classNames({
              'text-ellipsis break-words relative rounded-md p-2': true,
              'mr-2': isMyMessage,
              'order-2 ml-2': !isMyMessage,
            })
          }
        >
          <div style={{ width: messageLength, height: 20 }} className='rounded-full bg-primary-50 dark:bg-primary-800' />
        </div>

        <div className={classNames({ 'order-1': !isMyMessage })}>
          <PlaceholderAvatar size={34} />
        </div>
      </HStack>

      <HStack
        alignItems='center'
        space={2}
        className={classNames({
          'ml-auto': isMyMessage,
        })}
      >
        <Text
          theme='muted'
          size='xs'
          className={classNames({
            'text-right': isMyMessage,
            'order-2': !isMyMessage,
          })}
        >
          <div style={{ width: 50, height: 12 }} className='rounded-full bg-primary-50 dark:bg-primary-800' />
        </Text>

        <div className={classNames({ 'order-1': !isMyMessage })}>
          <div className='w-[34px] ml-2' />
        </div>
      </HStack>
    </Stack>
  );
};

export default PlaceholderChat;
