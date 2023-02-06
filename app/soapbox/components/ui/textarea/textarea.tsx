import clsx from 'clsx';
import React, { useState } from 'react';

interface ITextarea extends Pick<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength' | 'onChange' | 'onKeyDown' | 'onPaste' | 'required' | 'disabled' | 'rows' | 'readOnly'> {
  /** Put the cursor into the input on mount. */
  autoFocus?: boolean,
  /** Allows the textarea height to grow while typing */
  autoGrow?: boolean,
  /** Used with "autoGrow". Sets a max number of rows. */
  maxRows?: number,
  /** Used with "autoGrow". Sets a min number of rows. */
  minRows?: number,
  /** The initial text in the input. */
  defaultValue?: string,
  /** Internal input name. */
  name?: string,
  /** Renders the textarea as a code editor. */
  isCodeEditor?: boolean,
  /** Text to display before a value is entered. */
  placeholder?: string,
  /** Text in the textarea. */
  value?: string,
  /** Whether the device should autocomplete text in this textarea. */
  autoComplete?: string,
  /** Whether to display the textarea in red. */
  hasError?: boolean,
  /** Whether or not you can resize the teztarea */
  isResizeable?: boolean,
}

/** Textarea with custom styles. */
const Textarea = React.forwardRef(({
  isCodeEditor = false,
  hasError = false,
  isResizeable = true,
  onChange,
  autoGrow = false,
  maxRows = 10,
  minRows = 1,
  ...props
}: ITextarea, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
  const [rows, setRows] = useState<number>(autoGrow ? 1 : 4);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoGrow) {
      const textareaLineHeight = 20;
      const previousRows = event.target.rows;
      event.target.rows = minRows;

      const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

      if (currentRows === previousRows) {
        event.target.rows = currentRows;
      }

      if (currentRows >= maxRows) {
        event.target.rows = maxRows;
        event.target.scrollTop = event.target.scrollHeight;
      }

      setRows(currentRows < maxRows ? currentRows : maxRows);
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <textarea
      {...props}
      ref={ref}
      rows={rows}
      onChange={handleChange}
      className={clsx({
        'bg-white dark:bg-transparent shadow-sm block w-full sm:text-sm rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-600 dark:placeholder:text-gray-600 border-gray-400 dark:border-gray-800 dark:ring-1 dark:ring-gray-800 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500':
          true,
        'font-mono': isCodeEditor,
        'text-red-600 border-red-600': hasError,
        'resize-none': !isResizeable,
      })}
    />
  );
},
);

export default Textarea;
