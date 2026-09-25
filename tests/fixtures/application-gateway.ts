import type { Gateway } from '../../lib/applications/intake';
// Browser-only fixtures. Persistence/reconciliation is exercised separately against Code.gs.
const attempts = new Set<string>();
export const fixtureGateway: Gateway = {
  save: async ({ id, row }) => {
    if (row[2] === '@retry' && !attempts.has(id)) {
      attempts.add(id);
      return { status: 'uncertain' };
    }
    return { status: 'saved' };
  },
  notify: async () => ({ status: 'sent' }),
};
