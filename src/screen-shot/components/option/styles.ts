import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }) => ({
  item: css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    border-radius: 5px;
    cursor: pointer;
    color: ${token.colorWhite};
  `
}));
