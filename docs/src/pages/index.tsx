import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { fitnessTracker, googleFit, healthKit } from '@site/static/img/example';

import styles from './index.module.css';

const features = [
  {
    title: 'HealthKit integration',
    imageUrl: healthKit,
    description: (
      <>
        HealthKit API helps integrating your app with HealthKit enabled devices. Write and read various data such as steps, vitals, workouts, and more.
      </>
    ),
  },
  {
    title: 'FitnessTracker',
    imageUrl: fitnessTracker,
    description: (
      <>
        Best of it? You can use both HealthKit and GoogleFit at the same time, with single API. FitnessTracker will take care of the integration for you.
      </>
    ),
  },
  {
    title: 'Google Fit integration',
    imageUrl: googleFit,
    description: (
      <>
        GoogleFit API provides you access to various Google Fit data types. Easily write and read data such as steps, vitals, workouts, and more.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4')}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3 className="text--center">{title}</h3>
      <p className="text--center">{description}</p>
    </div>
  );
}

function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/fundamentals/getting-started')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
