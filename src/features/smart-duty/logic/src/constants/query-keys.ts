export const equipmentQueryKeys = {
  all: ['equipment'] as const,
  detail: (id: string) => [...equipmentQueryKeys.all, 'detail', id] as const,
};
