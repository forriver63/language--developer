import type { Overview } from '../types/report';

export function OverviewView({ overview }: { overview: Overview }) {
  if (!overview.corePattern && !overview.plainExplanation) return null;
  return (
    <div className="overview">
      <p className="overview-core">{overview.corePattern}</p>
      {overview.plainExplanation && <p className="overview-plain">{overview.plainExplanation}</p>}
    </div>
  );
}
