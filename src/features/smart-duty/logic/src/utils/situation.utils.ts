import {
  SituationThreatLevel,
  type SituationThreatLevel as SituationThreatLevelValue,
} from '../const/situation-threat-level';

export type { SituationThreatLevelValue as SituationThreatLevel };

export function resolveThreatLevelThreshHold(level: number): SituationThreatLevelValue {
  if (level >= 4) return SituationThreatLevel.CRITICAL;
  if (level >= 3) return SituationThreatLevel.HIGH;
  if (level >= 2) return SituationThreatLevel.MEDIUM;
  if (level >= 1) return SituationThreatLevel.LOW;
  return SituationThreatLevel.INFO;
}
