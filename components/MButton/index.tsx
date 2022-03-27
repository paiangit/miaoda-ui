import { FC } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import 'antd/dist/antd.less';

export type MButtonSizeType =
  | 'link'
  | 'text'
  | 'ghost'
  | 'default'
  | 'primary'
  | 'dashed'
  | undefined;

export interface MButtonProps extends ButtonProps {
  // 文案
  innerText?: string;
  // 类型
  type?: MButtonSizeType;
  // 禁用属性
  disabled?: boolean;
  // 尺寸
  size?: 'small' | 'middle' | 'large' | undefined;
  // 图标
  iconSelect?: string;
}

const defaultProps: MButtonProps = {
  innerText: '主要按钮',
  type: 'primary',
  disabled: false,
  size: 'middle',
  iconSelect: '',
};

export const MButton: FC<MButtonProps> = (props = defaultProps) => {
  return <Button type={props.type}>{props.innerText}</Button>;
};
