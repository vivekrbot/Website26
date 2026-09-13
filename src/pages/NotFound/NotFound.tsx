import { Seo } from '../../components/Seo/Seo';
import { Button } from '../../components/Button/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found — Vivek Ramachandran"
        description="The page you're looking for doesn't exist or may have moved."
        path="/404"
        noindex
      />

      <section className={`section ${styles.hero}`} aria-labelledby="not-found-heading">
        <div className="container">
          <p className={`label ${styles.eyebrow}`}>404</p>
          <h1 id="not-found-heading" className={`display-2 ${styles.title}`}>
            Page not found.
          </h1>
          <p className={styles.body}>
            The page you're looking for doesn't exist or may have moved.
          </p>
          <Button as="link" href="/" size="lg">
            Back to home
          </Button>
        </div>
      </section>
    </>
  );
}
