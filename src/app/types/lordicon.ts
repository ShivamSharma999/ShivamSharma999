import type { CSSProperties } from "react";

export interface LordIcon extends HTMLElement {
  playerInstance?: { playFromStart: () => void; play: () => void };
}

export interface LordIconProps {
  src: string;
  trigger?: string;
  colors?: string;
  stroke?: string | number;
  state?: string;
  speed?: number | string;
  target?: string;
  loading?: string;
  style?: CSSProperties;
  size?: number | string;
  className?: string;
  onReady?: () => void;
  [key: string]: unknown;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}
