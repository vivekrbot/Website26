import { Helmet } from 'react-helmet-async';
import { Hero } from '../../sections/Hero/Hero';
import { AboutSnippet } from '../../sections/AboutSnippet/AboutSnippet';
import { WorksSnippet } from '../../sections/WorksSnippet/WorksSnippet';
import { MentorshipSnippet } from '../../sections/MentorshipSnippet/MentorshipSnippet';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>itsvivek.Home</title>
        <meta name="description" content="Portfolio of Vivek Ramachandran a product designer and strategist building experiences that are clear, crafted, and consequential." />
        <meta property="og:title" content="Vivek Ramachandran Product Design & Strategy" />
        <meta property="og:description" content="Portfolio of Vivek Ramachandran product designer and strategist." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Hero />
      <AboutSnippet />
      <WorksSnippet />
      <MentorshipSnippet />
    </>
  );
}
