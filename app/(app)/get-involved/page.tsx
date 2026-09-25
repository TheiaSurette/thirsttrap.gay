import type { Metadata } from 'next';
import ApplicationForm from './ApplicationForm';

export const metadata: Metadata = {
  title: 'Get involved',
  description:
    'DJ, perform drag, vend, or volunteer at future Thirst Trap events. Beginners welcome.',
};
export const maxDuration = 60;

export default function GetInvolvedPage() {
  return (
    <main id="main" className="shell">
      <div
        className="prose-page"
        style={{ maxWidth: 680, marginInline: 'auto' }}
      >
        <h1 className="page-title">Get involved.</h1>
        <p className="prose" style={{ marginTop: 20 }}>
          Apply to DJ, perform drag, vend, or volunteer at future Thirst Trap
          events.
        </p>
        <p className="prose" style={{ marginTop: 20 }}>
          All experience levels are welcome. This is an expression of interest
          in future events, not a confirmed booking or volunteer shift.
        </p>
      </div>
      <ApplicationForm />
    </main>
  );
}
