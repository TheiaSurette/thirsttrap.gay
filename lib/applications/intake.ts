import { validateApplication, roleDefinitions } from './validation';
import { createHash } from 'node:crypto';

export type Delivery = {
  id: string;
  fingerprint: string;
  row: string[];
  rateKey: string;
};
export type DeliveryResult = {
  status: 'saved' | 'uncertain' | 'conflict' | 'limited' | 'unavailable';
};
export type Gateway = {
  save: (application: Delivery) => Promise<DeliveryResult>;
  notify: (id: string) => Promise<{ status: string }>;
};
export type SubmissionResult = {
  status: 'saved' | 'invalid' | 'retry' | 'conflict';
  errors?: Record<string, string>;
  message?: string;
};

export async function submitApplication(
  raw: unknown,
  gateway: Gateway,
  context: { now: Date; rateKey: string },
): Promise<SubmissionResult> {
  const { values, errors } = validateApplication(raw);
  const id = raw && typeof raw === 'object' && 'id' in raw ? raw.id : '';
  if (
    typeof id !== 'string' ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      id,
    )
  )
    errors.form = 'Refresh the page and try again.';
  if (Object.keys(errors).length) return { status: 'invalid', errors };
  const row = [
    context.now.toISOString(),
    values.name,
    values.contact,
    '', // Legacy event-series column; native applications no longer distinguish series.
    values.referral,
    values.roles.map((role) => roleDefinitions[role].label).join(', '),
    ...Array<string>(13).fill(''),
  ];
  for (const role of values.roles) {
    const answer = values.answers[role]!;
    const columns =
      role === 'volunteer'
        ? [
            answer.description,
            answer.assignments
              .map((item) =>
                item === 'Other' ? `Other: ${answer.other}` : item,
              )
              .join(', '),
          ]
        : role === 'vendor'
          ? [answer.description, answer.experience, answer.examples]
          : [
              answer.experience,
              answer.description,
              answer.examples,
              answer.rate,
            ];
    row.splice(roleDefinitions[role].start, columns.length, ...columns);
  }
  const fingerprint = createHash('sha256')
    .update(JSON.stringify(row.slice(1)))
    .digest('hex');
  let delivery: DeliveryResult;
  try {
    delivery = await gateway.save({
      id: id as string,
      fingerprint,
      row,
      rateKey: context.rateKey,
    });
  } catch {
    delivery = { status: 'uncertain' };
  }
  if (delivery.status === 'conflict')
    return {
      status: 'conflict',
      message:
        'This delivery was already used for different answers. Contact contact@thirsttrap.gay for help.',
    };
  if (delivery.status === 'limited')
    return {
      status: 'retry',
      message:
        'There have been too many attempts. Your answers are still here. Please retry in an hour.',
    };
  if (delivery.status !== 'saved')
    return {
      status: 'retry',
      message:
        'We could not confirm delivery. Your answers are still here. Please retry.',
    };
  // The durable sheet note owns notification state. Mail failure cannot undo a saved application.
  try {
    await gateway.notify(id as string);
  } catch {
    /* Pending delivery remains visible to administrators. */
  }
  return { status: 'saved' };
}
