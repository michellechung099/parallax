"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useTransform, useScroll, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export default function Home() {
  const container = useRef(null);

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  // useScroll tracks progression of the scroll
  const { scrollYProgress } = useScroll({
    target: container,
    // tracker starts at start (start of target) and end (of window) and ends at (end of target) and start (of window)
    offset: ["start end", "end start"],
  });

  // height of the window
  const { height } = dimension;

  // useTransform transforms value of scroll progression into new values, used for parallax ( [0,1] transformed to [0, height* var] )
  // 4 y values for 4 columns of images
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    // smooth scroll component
    const lenis = new Lenis();

    // raf called every frame for internal use
    const raf = (time) => {
      lenis.raf(time);
      // tells browser you wish to perform animation
      requestAnimationFrame(raf);
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    requestAnimationFrame(raf);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // array of 12 image assets
  const images = [];
  function imageList() {
    for (let i = 1; i <= 12; i++) {
      let newImage = i + ".jpg";
      images.push(newImage);
    }
  }

  function createColumns(images, itemsPerColumn, yVals) {
    const columns = [];

    for (let i = 0; i < images.length; i += itemsPerColumn) {
      let columnImages = images.slice(i, i + itemsPerColumn);
      const yVal = yVals[Math.floor(i / itemsPerColumn)];
      columns.push(<Column images={columnImages} key={i} y={yVal} />);
    }

    return columns;
  }

  const yVals = [y, y2, y3, y4];

  const Column = ({ images, y }) => {
    return (
      <motion.div style={{ y }} className={styles.column}>
        {images.map((src, index) => {
          return (
            <div key={index} className={styles.imageContainer}>
              <Image src={`/images/${src}`} fill alt="unsplash-image" />
            </div>
          );
        })}
      </motion.div>
    );
  };

  imageList();

  return (
    <main className={styles.main}>
      <div ref={container} className={styles.gallery}>
        {createColumns(images, 3, yVals)}
      </div>
    </main>
  );
}
