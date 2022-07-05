import React from 'react';

import { isCustomEmoji, isNativeEmoji } from 'soapbox/features/emoji';
import unicodeMapping from 'soapbox/features/emoji/mapping';
import { joinPublicPath } from 'soapbox/utils/static';

import type { Emoji } from 'soapbox/features/emoji';

interface UnicodeMapping {
  filename: string,
}

interface IAutosuggestEmoji {
  emoji: Emoji,
}

const AutosuggestEmoji: React.FC<IAutosuggestEmoji> = ({ emoji }) => {
  let url, alt;

  if (isCustomEmoji(emoji)) {
    url = emoji.imageUrl;
    alt = emoji.colons;
  } else if (isNativeEmoji(emoji)) {
    const mapping = unicodeMapping[emoji.native] || unicodeMapping[emoji.native.replace(/\uFE0F$/, '')];

    if (!mapping) {
      return null;
    }

    url = joinPublicPath(`packs/emoji/${mapping.unified}.svg`);
    alt = emoji.native;
  } else {
    return <div />
  }

  return (
    <div className='autosuggest-emoji' data-testid='emoji'>
      <img
        className='emojione'
        src={url}
        alt={alt}
      />

      {emoji.colons}
    </div>
  );
};

export default AutosuggestEmoji;
