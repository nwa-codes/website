import type { JSX } from 'react';
import { useFormStatus } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faTriangleExclamation
} from '@awesome.me/kit-5c0a16ac00/icons/classic/solid';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { CheckboxGroup } from '@/components/CheckboxGroup';
import { ContactFormState } from '@/app/actions/contact';
import styles from './ContactForm.module.css';

type ContactFormProps = {
  state?: ContactFormState;
  action?: (formData: FormData) => void;
};

const checkboxOptions = [
  { id: 'sponsor', value: 'sponsor', label: 'Sponsor' },
  { id: 'host', value: 'host', label: 'Host' },
  { id: 'speaker', value: 'speaker', label: 'Speaker' }
];

const FormContent = ({ state }: { state?: ContactFormState }): JSX.Element => {
  const { pending } = useFormStatus();
  const isDisabled = pending || state?.success;

  return (
    <>
      <div className={styles.formRow}>
        <div className={styles.formFields}>
          <TextInput
            type="text"
            id="name"
            name="name"
            label="Name"
            errors={state?.errors?.name}
            disabled={isDisabled}
          />
          <TextInput
            type="email"
            id="email"
            name="email"
            label="Email Address"
            errors={state?.errors?.email}
            disabled={isDisabled}
          />
        </div>

        <CheckboxGroup
          label="Interested in Becoming A"
          name="interests"
          options={checkboxOptions}
          errors={state?.errors?.interests}
          disabled={isDisabled}
        />
      </div>

      {state?.success && (
        <div className={styles.successMessage}>
          <FontAwesomeIcon icon={faCircleCheck} />
          Thank you! Your submission has been received.
        </div>
      )}

      {state?.errors?._form && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {state.errors._form.join(', ')}
        </div>
      )}

      <Button
        type="submit"
        color="secondary"
        className={styles.submitButton}
        disabled={isDisabled}
        aria-live="polite"
        aria-describedby={pending ? 'submit-status' : state?.success ? 'success-status' : undefined}
      >
        {pending ? 'SENDING...' : state?.success ? 'SUBMITTED' : 'SUBMIT'}
      </Button>

      {pending && (
        <span id="submit-status" className={styles.srOnly}>
          Form is being submitted, please wait
        </span>
      )}

      {state?.success && (
        <span id="success-status" className={styles.srOnly}>
          Form has been successfully submitted
        </span>
      )}
    </>
  );
};

export const ContactForm = ({ state, action }: ContactFormProps): JSX.Element => {
  return (
    <section className={styles.contactForm} data-section="sponsor-form">
      <h2 className={styles.formTitle}>Become a NWA Codes Sponsor, Host, or Speaker</h2>
      <p className={styles.formDescription}>
        NWA Codes is actively looking for partners and sponsors for our events. If you or your
        company are interested in hosting, sponsoring, or assisting with any of our events, please
        share your contact details below.
      </p>

      <form action={action}>
        <FormContent state={state} />
      </form>
    </section>
  );
};
