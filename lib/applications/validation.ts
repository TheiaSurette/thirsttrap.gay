export const assignmentOptions = [
  'Monitoring',
  'Door',
  'Coat check',
  'Setting up/breaking down',
  'Other',
] as const;
export const roleDefinitions = {
  dj: {
    label: 'DJ',
    description: 'Music and specialties',
    hint: 'What do you love to play? Beginners are welcome.',
    start: 6,
  },
  drag: {
    label: 'Drag',
    description: 'Performance style',
    hint: 'Tell us about the performances you do or would like to create.',
    start: 10,
  },
  vendor: {
    label: 'Vendor',
    description: 'Products you make or sell',
    hint: 'Tell us what you would bring to the party.',
    start: 14,
  },
  volunteer: {
    label: 'Volunteer',
    description: 'Experience or interests',
    hint: 'Tell us how you would like to help. New to events? You are welcome here.',
    start: 17,
  },
} as const;
export type Role = keyof typeof roleDefinitions;
export type RoleAnswers = {
  description: string;
  experience: string;
  examples: string;
  rate: string;
  assignments: string[];
  other: string;
};
export type ApplicationValues = {
  name: string;
  contact: string;
  referral: string;
  roles: Role[];
  answers: Partial<Record<Role, RoleAnswers>>;
};
const object = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export function validateApplication(raw: unknown, aboutOnly = false) {
  const source = object(raw);
  const errors: Record<string, string> = {};
  function text(value: unknown, key: string, required = false, max = 2000) {
    if (value != null && typeof value !== 'string') {
      errors[key] = 'Enter text in this field.';
      return '';
    }
    const result = typeof value === 'string' ? value.trim() : '';
    if (required && !result) errors[key] = 'Please answer this question.';
    if (result.length > max) errors[key] = `Use ${max} characters or fewer.`;
    return result;
  }
  const name = text(source.name, 'name', true, 200);
  const contact = text(source.contact, 'contact', true, 300);
  if (contact && (contact.length < 2 || !/[\p{L}\p{N}]/u.test(contact)))
    errors.contact = 'Enter an Instagram handle or another way to contact you.';
  const referral = text(source.referral, 'referral', false, 1000);
  const selected = Array.isArray(source.roles) ? source.roles : [];
  const validRoles = Object.keys(roleDefinitions) as Role[];
  if (
    !selected.length ||
    selected.some((role) => !validRoles.includes(role as Role)) ||
    new Set(selected).size !== selected.length
  )
    errors.roles =
      'Choose at least one of the listed roles, without duplicates.';
  const roles = validRoles.filter((role) => selected.includes(role));
  const answers: Partial<Record<Role, RoleAnswers>> = {};
  if (!aboutOnly)
    for (const role of roles) {
      const group = object(source[role]);
      const description = text(group.description, `${role}.description`, true);
      const experience = text(
        group.experience,
        `${role}.experience`,
        false,
        1000,
      );
      const examples = text(group.examples, `${role}.examples`, false, 1000);
      const rate = text(group.rate, `${role}.rate`, false, 200);
      let assignments: string[] = [];
      let other = '';
      if (role === 'volunteer') {
        const list = Array.isArray(group.assignments) ? group.assignments : [];
        if (
          !list.length ||
          list.some(
            (item) =>
              !assignmentOptions.includes(
                item as (typeof assignmentOptions)[number],
              ),
          ) ||
          list.length > assignmentOptions.length
        )
          errors['volunteer.assignments'] =
            'Choose at least one assignment preference.';
        assignments = assignmentOptions.filter((item) => list.includes(item));
        other = text(
          group.other,
          'volunteer.other',
          assignments.includes('Other'),
          500,
        );
        if (!assignments.includes('Other')) other = '';
      }
      answers[role] = {
        description,
        experience,
        examples,
        rate,
        assignments,
        other,
      };
    }
  if (source.website) errors.form = 'The form could not be submitted.';
  return {
    values: {
      name,
      contact,
      referral,
      roles,
      answers,
    } satisfies ApplicationValues,
    errors,
  };
}
