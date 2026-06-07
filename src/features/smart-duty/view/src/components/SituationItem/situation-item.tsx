/**
 * Compound component — pattern giống shadcn Card:
 * https://ui.shadcn.com/docs/components/card
 *
 * <SituationItem situation={data}>
 *   <SituationItemHeader>
 *     <SituationItemMention />
 *     <SituationItemThreatBadge />
 *     <SituationItemToggle />
 *   </SituationItemHeader>
 *   <SituationItemRefs />
 *   <SituationItemSources>...</SituationItemSources>
 * </SituationItem>
 */
import { forwardRef, type MouseEvent, type ReactNode } from 'react';
import {
  alpha,
  Box,
  Stack,
  Typography,
  type BoxProps,
  type StackProps,
  type TypographyProps,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SituationThreatLevel } from '@smart-duty/logic';
import {
  SituationItemProvider,
  useSituationItem,
  type SituationItemProviderProps,
  type SituationItemVariant,
} from './situation-item-context';

// ─── tokens (view layer) ───────────────────────────────────────────

const situationItemTokens = {
  red_1000: '#3d1519',
  text: '#fff',
  sourceLabel: '#929FB0',
  notificationBorder: '#FFFFFF1A',
  notificationBg: '#A6C5E229',
  collapsedBg: '#262B31',
  expandedBg: '#232F46',
} as const;

// ─── Root ──────────────────────────────────────────────────────────

export type SituationItemProps = Omit<SituationItemProviderProps, 'children'> &
  Omit<StackProps, 'children'> & {
    children?: ReactNode;
  };

const SituationItem = forwardRef<HTMLDivElement, SituationItemProps>(
  (
    {
      situation,
      variant,
      defaultExpandAllCards,
      onOpenByClick,
      children,
      sx,
      ...props
    },
    ref,
  ) => (
    <SituationItemProvider
      situation={situation}
      variant={variant}
      defaultExpandAllCards={defaultExpandAllCards}
      onOpenByClick={onOpenByClick}
    >
      <SituationItemFrame ref={ref} sx={sx} {...props}>
        {children ?? (
          <>
            <SituationItemHeader />
            <SituationItemRefs />
            <SituationItemSources />
          </>
        )}
      </SituationItemFrame>
    </SituationItemProvider>
  ),
);
SituationItem.displayName = 'SituationItem';

const SituationItemFrame = forwardRef<HTMLDivElement, StackProps>(
  ({ sx, children, ...props }, ref) => {
    const { variant, expanded, threatLevel, threatStyle } = useSituationItem();

    return (
      <Stack
        ref={ref}
        {...props}
        sx={[
          {
            p: 1.5,
            gap: 1.5,
            borderRadius: 0.75,
            border: '1px solid',
            width: '100%',
            borderColor:
              variant === 'notification'
                ? situationItemTokens.notificationBorder
                : alpha(threatStyle.borderColor, 0.5),
            bgcolor:
              variant === 'notification'
                ? situationItemTokens.notificationBg
                : !expanded
                  ? situationItemTokens.collapsedBg
                  : threatLevel === SituationThreatLevel.CRITICAL
                    ? situationItemTokens.red_1000
                    : situationItemTokens.expandedBg,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children}
      </Stack>
    );
  },
);
SituationItemFrame.displayName = 'SituationItemFrame';

// ─── Parts (named exports như shadcn) ──────────────────────────────

const SituationItemHeader = forwardRef<HTMLDivElement, StackProps>(
  ({ children, sx, onClick, ...props }, ref) => {
    const { expanded, toggle, onOpenByClick } = useSituationItem();

    return (
      <Stack
        ref={ref}
        direction="row"
        {...props}
        sx={[
          { gap: 1, alignItems: 'start', cursor: 'pointer' },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          toggle();
          if (!expanded) onOpenByClick?.();
        }}
      >
        {children}
      </Stack>
    );
  },
);
SituationItemHeader.displayName = 'SituationItemHeader';

const SituationItemMention = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ children, sx, ...props }, ref) => {
    const { situation, variant } = useSituationItem();

    return (
      <Typography
        ref={ref}
        component="span"
        {...props}
        sx={[
          {
            fontWeight: 'bold',
            fontSize: variant === 'notification' ? 14 : 16,
            flex: 1,
            color: situationItemTokens.text,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children ?? situation.mention}
      </Typography>
    );
  },
);
SituationItemMention.displayName = 'SituationItemMention';

const SituationItemThreatBadge = forwardRef<HTMLDivElement, StackProps>(
  ({ children, sx, ...props }, ref) => {
    const { threatStyle, showDetails } = useSituationItem();
    if (!showDetails) return null;

    return (
      <Stack
        ref={ref}
        {...props}
        sx={[
          {
            bgcolor: threatStyle.backgroundColor,
            border: `1px solid ${threatStyle.borderColor}`,
            borderRadius: 0.75,
            height: 20,
            px: 1,
            justifyContent: 'center',
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children ?? (
          <Typography
            component="span"
            sx={{ color: threatStyle.color, fontSize: 12, fontWeight: 600 }}
          >
            {threatStyle.label}
          </Typography>
        )}
      </Stack>
    );
  },
);
SituationItemThreatBadge.displayName = 'SituationItemThreatBadge';

const SituationItemToggle = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, sx, ...props }, ref) => {
    const { expanded } = useSituationItem();

    return (
      <Box
        ref={ref}
        {...props}
        sx={[
          {
            transform: expanded ? undefined : 'rotate(-90deg)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children ?? (
          <KeyboardArrowDownIcon
            sx={{ color: situationItemTokens.text, fontSize: 18 }}
          />
        )}
      </Box>
    );
  },
);
SituationItemToggle.displayName = 'SituationItemToggle';

const SituationItemRefs = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ children, sx, onClick, ...props }, ref) => {
    const { situation, expanded } = useSituationItem();

    return (
      <Typography
        ref={ref}
        component="span"
        {...props}
        sx={[
          {
            fontSize: 14,
            whiteSpace: 'pre-wrap',
            display: expanded ? undefined : 'none',
            color: situationItemTokens.text,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        onClick={(event: MouseEvent<HTMLSpanElement>) => {
          event.stopPropagation();
          onClick?.(event);
        }}
      >
        {children ?? situation.refs.join('\n')}
      </Typography>
    );
  },
);
SituationItemRefs.displayName = 'SituationItemRefs';

const SituationItemSources = forwardRef<HTMLDivElement, StackProps>(
  ({ children, sx, ...props }, ref) => {
    const { showDetails } = useSituationItem();
    if (!showDetails) return null;

    return (
      <Stack
        ref={ref}
        direction="row"
        {...props}
        sx={[
          { gap: 1, alignItems: 'center', flexWrap: 'wrap' },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {children}
      </Stack>
    );
  },
);
SituationItemSources.displayName = 'SituationItemSources';

const SituationItemSourcesLabel = forwardRef<HTMLSpanElement, TypographyProps>(
  ({ sx, ...props }, ref) => (
    <Typography
      ref={ref}
      component="span"
      {...props}
      sx={[
        { color: situationItemTokens.sourceLabel, fontSize: 12 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      Nguồn:
    </Typography>
  ),
);
SituationItemSourcesLabel.displayName = 'SituationItemSourcesLabel';

export {
  SituationItem,
  SituationItemHeader,
  SituationItemMention,
  SituationItemThreatBadge,
  SituationItemToggle,
  SituationItemRefs,
  SituationItemSources,
  SituationItemSourcesLabel,
};

export type { SituationItemVariant };
