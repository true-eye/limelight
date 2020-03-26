import { message } from 'antd';

// DVA
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
      message.error(err.message);
    },
  },
};
