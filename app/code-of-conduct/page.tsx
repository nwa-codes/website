import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import styles from './page.module.css';
import type { JSX } from 'react';

export default function CodeOfConduct(): JSX.Element {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <article className={styles.content}>
          <h1 className={styles.pageTitle}>Code of Conduct</h1>

          <p className={styles.intro}>
            All members, speakers, sponsors, and volunteers at our software engineering events are
            required to agree with the following code of conduct. Organizers will enforce this code
            at all events and in our online spaces.
          </p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>tl;dr:</h2>
            <p className={styles.text}>
              Our community is dedicated to providing a welcoming, harassment-free experience for
              everyone, regardless of gender, gender identity and expression, age, sexual
              orientation, disability, physical appearance, body size, race, ethnicity, religion (or
              lack thereof), technology choices, or experience level. We do not tolerate harassment
              of participants in any form. Sexual language and imagery is not appropriate for any
              event venue, including talks, workshops, social events, chat platforms, or social
              media. Participants violating these rules may be sanctioned or removed from the event
              and future events at the discretion of the organizers.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Community Values</h2>
            <p className={styles.text}>We strive to be a community where:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Everyone feels welcome</strong> – Whether you're a seasoned engineer or
                writing your first "Hello World," you belong here.
              </li>
              <li className={styles.listItem}>
                <strong>Learning is encouraged</strong> – There are no stupid questions. We're all
                here to grow together.
              </li>
              <li className={styles.listItem}>
                <strong>Respect is the default</strong> – We treat each other with kindness and
                assume good intentions.
              </li>
              <li className={styles.listItem}>
                <strong>Collaboration thrives</strong> – We support each other's success and
                celebrate our wins together.
              </li>
              <li className={styles.listItem}>
                <strong>Diversity strengthens us</strong> – Different perspectives and backgrounds
                make our community richer.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Expected Behavior</h2>
            <p className={styles.text}>We expect all community members to:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Be kind, considerate, and respectful in all interactions
              </li>
              <li className={styles.listItem}>Use welcoming and inclusive language</li>
              <li className={styles.listItem}>
                Respect different viewpoints, experiences, and skill levels
              </li>
              <li className={styles.listItem}>Give and accept constructive feedback gracefully</li>
              <li className={styles.listItem}>Focus on what's best for the community</li>
              <li className={styles.listItem}>Show empathy toward other community members</li>
              <li className={styles.listItem}>
                Be mindful of your surroundings and fellow participants
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Unacceptable Behavior</h2>
            <p className={styles.text}>
              Harassment and other inappropriate behavior will not be tolerated. This includes:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Offensive verbal or written comments related to gender, gender identity and
                expression, age, sexual orientation, disability, physical appearance, body size,
                race, ethnicity, religion, or technology choices
              </li>
              <li className={styles.listItem}>
                Sexual images or language in any community venue or communication channel
              </li>
              <li className={styles.listItem}>Deliberate intimidation, stalking, or following</li>
              <li className={styles.listItem}>Harassing photography or recording</li>
              <li className={styles.listItem}>
                Sustained disruption of talks, presentations, or other events
              </li>
              <li className={styles.listItem}>
                Inappropriate physical contact or unwelcome sexual attention
              </li>
              <li className={styles.listItem}>
                Advocating for, or encouraging, any of the above behavior
              </li>
              <li className={styles.listItem}>
                Pattern of inappropriate social contact, such as requesting/assuming inappropriate
                levels of intimacy with others
              </li>
              <li className={styles.listItem}>
                Continued one-on-one communication after requests to cease
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Scope</h2>
            <p className={styles.text}>
              This Code of Conduct applies to all community spaces, both online and off, including:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Events and presentations</li>
              <li className={styles.listItem}>Social gatherings before, during, or after events</li>
              <li className={styles.listItem}>Online chat platforms, forums, and social media</li>
              <li className={styles.listItem}>
                One-on-one communications related to community business
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Enforcement</h2>
            <p className={styles.text}>
              If a participant engages in behavior that violates this code of conduct, the
              organizers may take any action they deem appropriate, including:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Warning the individual</li>
              <li className={styles.listItem}>Asking the individual to leave the event</li>
              <li className={styles.listItem}>Banning the individual from future events</li>
              <li className={styles.listItem}>
                Reporting the behavior to appropriate authorities if necessary
              </li>
            </ul>
            <p className={styles.text}>
              Participants asked to stop any inappropriate behavior are expected to comply
              immediately.
            </p>
            <p className={styles.text}>
              Sponsors and speakers are also subject to this code of conduct. They should not use
              sexualized images, activities, or other material in their presentations or booth/table
              materials.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Reporting</h2>
            <p className={styles.text}>
              If you are being harassed, notice that someone else is being harassed, or have any
              other concerns, please contact an organizer immediately.
            </p>
            <p className={styles.text}>
              You can also reach us at{' '}
              <a href="mailto:nwacodes@gmail.com" className={styles.emailLink}>
                nwacodes@gmail.com
              </a>
              .
            </p>
            <p className={styles.text}>
              All reports will be handled with discretion and confidentiality. We will respect your
              privacy and security.
            </p>
          </section>

          <p className={styles.footer}>
            We're grateful you're here and value your participation in building a positive,
            inclusive community.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
