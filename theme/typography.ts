import { getWebTextVariants } from '@leather-wallet/tokens';
import { defineTextStyles } from '@pandacss/dev';

// ts-unused-exports:disable-next-line
export const textStyles = defineTextStyles({ ...getWebTextVariants() });
