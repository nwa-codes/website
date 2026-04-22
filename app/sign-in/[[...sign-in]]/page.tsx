import type { JSX } from 'react';
import { SignIn } from '@clerk/nextjs';

import styles from './SignInPage.module.css';

const SignInPage = (): JSX.Element => {
  return (
    <main className={styles.container}>
      <SignIn />
    </main>
  );
};

export default SignInPage;
