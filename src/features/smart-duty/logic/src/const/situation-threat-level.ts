export const SituationThreatLevel = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  INFO: 'INFO',
} as const;

export type SituationThreatLevel =
  (typeof SituationThreatLevel)[keyof typeof SituationThreatLevel];

export const situationThreatLevelDefinition: Record<
  SituationThreatLevel,
  {
    backgroundColor: string;
    borderColor: string;
    color: string;
    label: string;
  }
> = {
  [SituationThreatLevel.CRITICAL]: {
    backgroundColor: '#ff4d6a22',
    borderColor: '#ff4d6a',
    color: '#ff4d6a',
    label: 'Nghiêm trọng',
  },
  [SituationThreatLevel.HIGH]: {
    backgroundColor: '#f5a62322',
    borderColor: '#f5a623',
    color: '#f5a623',
    label: 'Cao',
  },
  [SituationThreatLevel.MEDIUM]: {
    backgroundColor: '#00d4ff22',
    borderColor: '#00d4ff',
    color: '#00d4ff',
    label: 'Trung bình',
  },
  [SituationThreatLevel.LOW]: {
    backgroundColor: '#7a9bb822',
    borderColor: '#7a9bb8',
    color: '#7a9bb8',
    label: 'Thấp',
  },
  [SituationThreatLevel.INFO]: {
    backgroundColor: '#4a6a8522',
    borderColor: '#4a6a85',
    color: '#4a6a85',
    label: 'Thông tin',
  },
};
