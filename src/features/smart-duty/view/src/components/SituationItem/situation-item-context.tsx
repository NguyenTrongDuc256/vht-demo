import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  resolveThreatLevelThreshHold,
  SituationThreatLevel,
  situationThreatLevelDefinition,
  type IEventSituation,
} from '@smart-duty/logic';

export type SituationItemVariant = 'timeline' | 'list' | 'notification';

export type SituationThreatStyle =
  (typeof situationThreatLevelDefinition)[keyof typeof situationThreatLevelDefinition];

export interface SituationItemContextValue {
  situation: IEventSituation;
  variant: SituationItemVariant;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  toggle: () => void;
  threatLevel: ReturnType<typeof resolveThreatLevelThreshHold>;
  threatStyle: SituationThreatStyle;
  showDetails: boolean;
  onOpenByClick?: () => void;
}

const SituationItemContext = createContext<SituationItemContextValue | null>(null);

export function useSituationItem() {
  const context = useContext(SituationItemContext);
  if (!context) {
    throw new Error('useSituationItem must be used within <SituationItem>.');
  }
  return context;
}

export interface SituationItemProviderProps {
  situation: IEventSituation;
  variant?: SituationItemVariant;
  defaultExpandAllCards?: boolean;
  onOpenByClick?: () => void;
  children: ReactNode;
}

/** UI state only — không import Redux */
export function SituationItemProvider({
  situation,
  variant = 'list',
  defaultExpandAllCards,
  onOpenByClick,
  children,
}: SituationItemProviderProps) {
  const threatLevel = resolveThreatLevelThreshHold(situation.threatLevel);
  const threatStyle = situationThreatLevelDefinition[threatLevel];

  const [expanded, setExpanded] = useState(
    variant === 'notification'
      ? !!defaultExpandAllCards
      : threatLevel === SituationThreatLevel.CRITICAL,
  );

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setExpanded(!!defaultExpandAllCards);
  }, [defaultExpandAllCards]);

  const toggle = useCallback(() => setExpanded((prev) => !prev), []);
  const showDetails = variant !== 'notification' || expanded;

  const value = useMemo<SituationItemContextValue>(
    () => ({
      situation,
      variant,
      expanded,
      setExpanded,
      toggle,
      threatLevel,
      threatStyle,
      showDetails,
      onOpenByClick,
    }),
    [
      situation,
      variant,
      expanded,
      toggle,
      threatLevel,
      threatStyle,
      showDetails,
      onOpenByClick,
    ],
  );

  return (
    <SituationItemContext.Provider value={value}>
      {children}
    </SituationItemContext.Provider>
  );
}
