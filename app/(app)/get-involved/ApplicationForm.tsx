'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import {
  assignmentOptions,
  roleDefinitions,
  validateApplication,
  type Role,
  type RoleAnswers,
} from '@/lib/applications/validation';
import type { SubmissionResult } from '@/lib/applications/intake';
import { sendApplication } from './actions';
import styles from './form.module.css';

const roles = Object.keys(roleDefinitions) as Role[];
const blankAnswer = (): RoleAnswers => ({
  description: '',
  experience: '',
  examples: '',
  rate: '',
  assignments: [],
  other: '',
});
const initialAnswers = () =>
  Object.fromEntries(roles.map((role) => [role, blankAnswer()])) as Record<
    Role,
    RoleAnswers
  >;
type TextField = 'name' | 'contact' | 'referral' | 'website';

export default function ApplicationForm() {
  const [about, setAbout] = useState({
    name: '',
    contact: '',
    referral: '',
    website: '',
  });
  const [selected, setSelected] = useState<Role[]>([]);
  const [answers, setAnswers] = useState(initialAnswers);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [delivery, setDelivery] = useState<Record<string, unknown> | null>(
    null,
  );
  const summary = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const locked = result?.status === 'retry' || result?.status === 'conflict';

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (Object.keys(errors).length || result) summary.current?.focus();
  }, [errors, result]);

  function changeAbout(key: TextField, value: string) {
    setAbout((current) => ({ ...current, [key]: value }));
  }
  function changeAnswer(
    role: Role,
    key: keyof RoleAnswers,
    value: string | string[],
  ) {
    setAnswers((current) => ({
      ...current,
      [role]: { ...current[role], [key]: value },
    }));
  }
  function fieldError(key: string) {
    return errors[key] ? (
      <p id={`${key}-error`} className={styles.error}>
        {errors[key]}
      </p>
    ) : null;
  }
  function errorProps(key: string, hint?: string) {
    return {
      'aria-invalid': Boolean(errors[key]),
      'aria-describedby':
        [hint, errors[key] && `${key}-error`].filter(Boolean).join(' ') ||
        undefined,
    };
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const raw = { ...about, roles: selected, ...answers };
    let application = delivery;
    if (!locked) {
      const checked = validateApplication(raw, step === 1);
      setErrors(checked.errors);
      if (Object.keys(checked.errors).length) return;
      if (step === 1) {
        setStep(2);
        return;
      }
      application = { ...raw, id: crypto.randomUUID() };
      setDelivery(application);
    }
    startTransition(async () => {
      let response: SubmissionResult;
      try {
        response = await sendApplication(application);
      } catch {
        response = {
          status: 'retry',
          message:
            'We could not confirm delivery. Your answers are still here. Please retry.',
        };
      }
      setResult(response);
      setErrors(response.errors || {});
      if (response.status === 'invalid') setDelivery(null);
    });
  }

  if (result?.status === 'saved')
    return (
      <section className={styles.success} aria-labelledby="success-title">
        <div ref={summary} tabIndex={-1} role="status">
          <h2 id="success-title">Application received.</h2>
          <p>
            Your application has been saved for the team to review. Thanks for
            wanting to be part of Thirst Trap.
          </p>
          <p>
            This expresses interest in future events; it does not confirm a
            booking or shift.
          </p>
        </div>
        <Link href="/" className="action primary">
          Back to events
        </Link>
      </section>
    );

  return (
    <form
      className={styles.form}
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      <ol className={styles.steps} aria-label="Application progress">
        <li aria-current={step === 1 ? 'step' : undefined}>
          <span>01</span> About you
        </li>
        <li aria-current={step === 2 ? 'step' : undefined}>
          <span>02</span> Your interests
        </li>
      </ol>
      <h2 ref={heading} tabIndex={-1}>
        {step === 1 ? 'First, an introduction.' : 'Tell us what you do.'}
      </h2>
      <p className={styles.note}>
        Fields marked * are required. Everything else is optional.
      </p>
      {(Object.keys(errors).length > 0 || result?.message) && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className={styles.summary}
        >
          {Object.keys(errors).length > 0 ? (
            <>
              <strong>A few things need your attention.</strong>
              <ul>
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>
                    <a href={`#${key}`}>
                      {message} ({key.replace('.', ': ')})
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <strong>{result?.message}</strong>
              <p>
                Keep this page open. Retrying checks the same application. Your
                answers are held unchanged until delivery is confirmed.
              </p>
              <p>
                Still stuck?{' '}
                <a href="mailto:contact@thirsttrap.gay">Contact the team</a> and
                include reference <code>{String(delivery?.id || '')}</code>.
              </p>
            </>
          )}
        </div>
      )}
      <fieldset disabled={pending || locked} className={styles.fields}>
        <legend className="sr-only">
          {step === 1 ? 'About you' : 'Your selected roles'}
        </legend>
        {step === 1 ? (
          <>
            <div className={styles.field}>
              <label htmlFor="name">Name, stage name, or business name *</label>
              <input
                id="name"
                autoComplete="name"
                value={about.name}
                onChange={(e) => changeAbout('name', e.target.value)}
                maxLength={200}
                required
                {...errorProps('name')}
              />
              {fieldError('name')}
            </div>
            <div className={styles.field}>
              <label htmlFor="contact">How can we contact you? *</label>
              <p id="contact-hint">
                Instagram is preferred. An email address or another contact
                method works too.
              </p>
              <input
                id="contact"
                value={about.contact}
                onChange={(e) => changeAbout('contact', e.target.value)}
                maxLength={300}
                required
                {...errorProps('contact', 'contact-hint')}
              />
              {fieldError('contact')}
            </div>
            <fieldset
              id="roles"
              className={styles.choices}
              {...errorProps('roles', 'roles-hint')}
            >
              <legend>How would you like to get involved? *</legend>
              <p id="roles-hint">Choose all that interest you.</p>
              <div className={styles.roleGrid}>
                {roles.map((role) => (
                  <label key={role}>
                    <input
                      type="checkbox"
                      checked={selected.includes(role)}
                      onChange={(e) =>
                        setSelected((current) =>
                          e.target.checked
                            ? [...current, role]
                            : current.filter((item) => item !== role),
                        )
                      }
                    />
                    {roleDefinitions[role].label === 'Drag'
                      ? 'Drag performer'
                      : roleDefinitions[role].label}
                  </label>
                ))}
              </div>
              {fieldError('roles')}
            </fieldset>
            <div className={styles.field}>
              <label htmlFor="referral">
                How did you hear about Thirst Trap? <span>(optional)</span>
              </label>
              <input
                id="referral"
                value={about.referral}
                onChange={(e) => changeAbout('referral', e.target.value)}
                maxLength={1000}
                {...errorProps('referral')}
              />
              {fieldError('referral')}
            </div>
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Leave this empty</label>
              <input
                id="website"
                tabIndex={-1}
                autoComplete="off"
                value={about.website}
                onChange={(e) => changeAbout('website', e.target.value)}
              />
            </div>
          </>
        ) : (
          roles
            .filter((role) => selected.includes(role))
            .map((role) => (
              <section
                key={role}
                className={styles.roleSection}
                aria-labelledby={`${role}-heading`}
              >
                <h3 id={`${role}-heading`}>
                  {role === 'drag'
                    ? 'Drag performer'
                    : roleDefinitions[role].label}
                </h3>
                <div className={styles.field}>
                  <label htmlFor={`${role}.description`}>
                    {roleDefinitions[role].description} *
                  </label>
                  <p id={`${role}-hint`}>{roleDefinitions[role].hint}</p>
                  <textarea
                    id={`${role}.description`}
                    rows={4}
                    value={answers[role].description}
                    onChange={(e) =>
                      changeAnswer(role, 'description', e.target.value)
                    }
                    maxLength={2000}
                    required
                    {...errorProps(`${role}.description`, `${role}-hint`)}
                  />
                  {fieldError(`${role}.description`)}
                </div>
                {role !== 'volunteer' && (
                  <>
                    <div className={styles.field}>
                      <label htmlFor={`${role}.experience`}>
                        {role === 'vendor'
                          ? 'Past vending experience'
                          : 'How long have you been doing this?'}{' '}
                        <span>(optional)</span>
                      </label>
                      <input
                        id={`${role}.experience`}
                        value={answers[role].experience}
                        onChange={(e) =>
                          changeAnswer(role, 'experience', e.target.value)
                        }
                        maxLength={1000}
                        {...errorProps(`${role}.experience`)}
                      />
                      {fieldError(`${role}.experience`)}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor={`${role}.examples`}>
                        Where can we see your work? <span>(optional)</span>
                      </label>
                      <p id={`${role}-examples-hint`}>
                        Links, handles, or a note are all welcome.
                      </p>
                      <input
                        id={`${role}.examples`}
                        value={answers[role].examples}
                        onChange={(e) =>
                          changeAnswer(role, 'examples', e.target.value)
                        }
                        maxLength={1000}
                        {...errorProps(
                          `${role}.examples`,
                          `${role}-examples-hint`,
                        )}
                      />
                      {fieldError(`${role}.examples`)}
                    </div>
                    {role !== 'vendor' && (
                      <div className={styles.field}>
                        <label htmlFor={`${role}.rate`}>
                          Typical rate <span>(optional)</span>
                        </label>
                        <input
                          id={`${role}.rate`}
                          value={answers[role].rate}
                          onChange={(e) =>
                            changeAnswer(role, 'rate', e.target.value)
                          }
                          maxLength={200}
                          {...errorProps(`${role}.rate`)}
                        />
                        {fieldError(`${role}.rate`)}
                      </div>
                    )}
                  </>
                )}
                {role === 'volunteer' && (
                  <>
                    <fieldset
                      id="volunteer.assignments"
                      className={styles.choices}
                      {...errorProps('volunteer.assignments')}
                    >
                      <legend>What would you like to help with? *</legend>
                      {assignmentOptions.map((option) => (
                        <label key={option}>
                          <input
                            type="checkbox"
                            checked={answers.volunteer.assignments.includes(
                              option,
                            )}
                            onChange={(e) =>
                              changeAnswer(
                                'volunteer',
                                'assignments',
                                e.target.checked
                                  ? [...answers.volunteer.assignments, option]
                                  : answers.volunteer.assignments.filter(
                                      (item) => item !== option,
                                    ),
                              )
                            }
                          />
                          {option}
                        </label>
                      ))}
                      {fieldError('volunteer.assignments')}
                    </fieldset>
                    {answers.volunteer.assignments.includes('Other') && (
                      <div className={styles.field}>
                        <label htmlFor="volunteer.other">
                          Tell us about your other preference *
                        </label>
                        <input
                          id="volunteer.other"
                          value={answers.volunteer.other}
                          onChange={(e) =>
                            changeAnswer('volunteer', 'other', e.target.value)
                          }
                          maxLength={500}
                          required
                          {...errorProps('volunteer.other')}
                        />
                        {fieldError('volunteer.other')}
                      </div>
                    )}
                  </>
                )}
              </section>
            ))
        )}
      </fieldset>
      {step === 2 && (
        <p className={styles.privacy}>
          Your answers go to the Thirst Trap team’s private application sheet so
          we can review your interests and contact you. They will not appear on
          this website. Questions?{' '}
          <a href="mailto:contact@thirsttrap.gay">contact@thirsttrap.gay</a>
        </p>
      )}
      <div className={styles.actions}>
        {step === 2 && !locked && (
          <button
            type="button"
            className="action secondary"
            disabled={pending}
            onClick={() => {
              setStep(1);
              setErrors({});
              setResult(null);
            }}
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="action primary"
          disabled={pending || result?.status === 'conflict'}
        >
          {pending
            ? 'Sending…'
            : locked
              ? 'Retry delivery'
              : step === 1
                ? 'Continue →'
                : 'Send application'}
        </button>
      </div>
      <noscript>
        This form needs JavaScript. You can also contact{' '}
        <a href="mailto:contact@thirsttrap.gay">contact@thirsttrap.gay</a>.
      </noscript>
    </form>
  );
}
