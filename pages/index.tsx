import type { NextPage } from "next";
import Head from "next/head";
//import Image from 'next/image'
//import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>meet a drifter</title>
        <meta
          name="description"
          content="conversation for people who have $5 a month to spare"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="text-3xl font-bold">header</header>
      <main className="">main</main>
      <footer className="">footer</footer>
    </div>
  );
};

export default Home;
