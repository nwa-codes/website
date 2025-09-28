import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import styles from './not-found.module.css';
import type { JSX } from 'react';

export default function NotFound(): JSX.Element {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <article className={styles.content}>
          <div className={styles.errorCode} role="img" aria-label="Error 404">
            404
          </div>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" className={styles.buttonLink}>
            <Button variant="default" color="secondary">
              Return Home
            </Button>
          </Link>
        </article>
      </main>

      <Footer />
    </div>
  );
}
