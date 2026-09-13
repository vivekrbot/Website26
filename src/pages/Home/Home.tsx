import { Seo } from '../../components/Seo/Seo';
import { Hero } from '../../sections/Hero/Hero';
import { AboutSnippet } from '../../sections/AboutSnippet/AboutSnippet';
import { WorksSnippet } from '../../sections/WorksSnippet/WorksSnippet';
import { MentorshipSnippet } from '../../sections/MentorshipSnippet/MentorshipSnippet';
import { StarShooter } from '../../components/StarShooter/StarShooter';

export default function Home() {
  return (
    <>
      <Seo
        title="Vivek Ramachandran — Product Design & Strategy"
        description="Portfolio of Vivek Ramachandran, a product designer and strategist building experiences that are clear, crafted, and consequential."
        path="/"
      />

      <Hero />
      <AboutSnippet />
      <WorksSnippet />
      <MentorshipSnippet />
      <StarShooter />
    </>
  );
}
