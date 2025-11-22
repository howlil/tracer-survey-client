/** @format */

import {toast} from 'sonner';

type ShowSequentialErrorOptions = {
  messages: Array<string | null | undefined>;
  delay?: number;
  duration?: number;
};

const DEFAULT_DELAY = 3200;

export const showSequentialErrorToasts = ({
  messages,
  delay = DEFAULT_DELAY,
  duration,
}: ShowSequentialErrorOptions) => {
  const filteredMessages = messages
    .map((msg) => (typeof msg === 'string' ? msg.trim() : ''))
    .filter((msg) => !!msg);

  filteredMessages.forEach((message, index) => {
    setTimeout(() => {
      toast.error(message, {
        duration,
      });
    }, index * delay);
  });
};
