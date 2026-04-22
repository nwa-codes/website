'use client';

import type { JSX } from 'react';
import { useId, useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import styles from './SignIn.module.css';

type Step = 'identifier' | 'password' | 'email_code';
type EmailCodeSource = 'first_factor' | 'second_factor';

/**
 * Inspects supported first factors after identification to determine
 * whether to proceed with password or email code authentication.
 */
const resolveNextStep = (
  supportedFirstFactors: Array<{ strategy: string }>
): Step => {
  const hasPassword = supportedFirstFactors.some(
    (factor) => factor.strategy === 'password'
  );
  return hasPassword ? 'password' : 'email_code';
};

/**
 * Custom sign-in page implementing the Clerk v7 Future API flow.
 * Supports email + password and email + one-time code strategies.
 */
const SignInPage = (): JSX.Element => {
  const emailId = useId();
  const passwordId = useId();
  const codeId = useId();

  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>('identifier');
  const [emailCodeSource, setEmailCodeSource] = useState<EmailCodeSource>('first_factor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = fetchStatus === 'fetching' || isSubmitting;

  const resolveDisplayError = (): string | null => {
    if (submitError !== null) {
      return submitError;
    }

    if (step === 'identifier' && errors.fields.identifier !== null) {
      return errors.fields.identifier.message;
    }

    if (step === 'password' && errors.fields.password !== null) {
      return errors.fields.password.message;
    }

    if (step === 'email_code' && errors.fields.code !== null) {
      return errors.fields.code.message;
    }

    if (errors.global !== null && errors.global.length > 0) {
      return errors.global[0].message;
    }

    return null;
  };

  const handleIdentifierSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await signIn.create({ identifier: email });

    if (error !== null) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    const nextStep = resolveNextStep(signIn.supportedFirstFactors);

    if (nextStep === 'email_code') {
      const { error: sendError } = await signIn.emailCode.sendCode();
      if (sendError !== null) {
        setSubmitError(sendError.message);
        setIsSubmitting(false);
        return;
      }
      setEmailCodeSource('first_factor');
    }

    setStep(nextStep);
    setIsSubmitting(false);
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } = await signIn.password({ password });

    if (error !== null) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    if (signIn.status === 'needs_second_factor') {
      const { error: sendError } = await signIn.mfa.sendEmailCode();
      if (sendError !== null) {
        setSubmitError(sendError.message);
        setIsSubmitting(false);
        return;
      }
      setEmailCodeSource('second_factor');
      setIsSubmitting(false);
      setStep('email_code');
      return;
    }

    if (signIn.status === 'complete') {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError !== null) {
        setSubmitError(finalizeError.message);
        setIsSubmitting(false);
        return;
      }
      router.push('/admin');
      return;
    }

    setSubmitError('Sign in could not be completed. Please try again.');
    setIsSubmitting(false);
  };

  const handleEmailCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const { error } =
      emailCodeSource === 'second_factor'
        ? await signIn.mfa.verifyEmailCode({ code })
        : await signIn.emailCode.verifyCode({ code });

    if (error !== null) {
      setSubmitError(error.message);
      setIsSubmitting(false);
      return;
    }

    if (signIn.status === 'complete') {
      const { error: finalizeError } = await signIn.finalize();
      if (finalizeError !== null) {
        setSubmitError(finalizeError.message);
        setIsSubmitting(false);
        return;
      }
      router.push('/admin');
      return;
    }

    setSubmitError('Verification could not be completed. Please try again.');
    setIsSubmitting(false);
  };

  const handleBackToIdentifier = () => {
    setStep('identifier');
    setSubmitError(null);
    setPassword('');
    setCode('');
  };

  const displayError = resolveDisplayError();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Image
            src="/nwa-codes-white-transparent.svg"
            alt="NWA Codes"
            width={48}
            height={48}
          />
        </div>

        <h1 className={styles.heading}>Sign In</h1>

        {step === 'identifier' && (
          <form onSubmit={handleIdentifierSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={emailId}>
                Email address
              </label>
              <input
                id={emailId}
                className={styles.input}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
              />
            </div>

            {displayError !== null && (
              <p className={styles.error}>{displayError}</p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <p className={styles.hint}>{email}</p>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={passwordId}>
                Password
              </label>
              <input
                id={passwordId}
                className={styles.input}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
              />
            </div>

            {displayError !== null && (
              <p className={styles.error}>{displayError}</p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              className={styles.backButton}
              type="button"
              onClick={handleBackToIdentifier}
              disabled={isLoading}
            >
              Use a different email
            </button>
          </form>
        )}

        {step === 'email_code' && (
          <form onSubmit={handleEmailCodeSubmit} className={styles.form}>
            <p className={styles.hint}>
              We sent a verification code to <strong>{email}</strong>. Enter it below to continue.
            </p>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={codeId}>
                Verification code
              </label>
              <input
                id={codeId}
                className={styles.input}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                disabled={isLoading}
              />
            </div>

            {displayError !== null && (
              <p className={styles.error}>{displayError}</p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              className={styles.backButton}
              type="button"
              onClick={handleBackToIdentifier}
              disabled={isLoading}
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default SignInPage;
