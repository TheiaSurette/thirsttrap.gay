'use client';

import { useActionState, useState } from 'react';
import { signUpForNewsletter } from './actions';
import styles from './newsletter.module.css';

export default function NewsletterSignup() {
  const [result, action, pending] = useActionState(signUpForNewsletter, null);
  const [email, setEmail] = useState('');

  return (
    <section className={styles.newsletter} aria-labelledby="newsletter-title">
      <div>
        <p className="eyebrow">The Thirst Trap newsletter</p>
        <h2 id="newsletter-title">See you at the next one.</h2>
        <p>Get event announcements and news from Thirst Trap in your inbox.</p>
      </div>
      <form action={action} className={styles.form} aria-busy={pending}>
        <label htmlFor="newsletter-email">Email address</label>
        <div className={styles.fields}>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            readOnly={pending}
            aria-describedby={`newsletter-consent${result ? ' newsletter-status' : ''}`}
          />
          <button className="action primary" type="submit" disabled={pending}>
            {pending ? 'Signing up…' : 'Sign me up'}{' '}
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="newsletter-website">Leave this field empty</label>
          <input
            id="newsletter-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <p id="newsletter-consent" className={styles.note}>
          Sign up to receive our newsletter. Unsubscribe anytime.
        </p>
        {result && (
          <p
            id="newsletter-status"
            role={result.success ? 'status' : 'alert'}
            className={styles.status}
          >
            {result.message}
          </p>
        )}
      </form>
    </section>
  );
}
