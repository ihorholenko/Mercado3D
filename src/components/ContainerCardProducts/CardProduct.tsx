import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'
import { createCss } from "@utils";
import styles from "./CardProduct.module.scss";
import { useAnimationFrame } from './useAnimationFrame';

type props = {
  imgUrl: string,
  price: number,
  titleProd?: string,
  description?: string,
  freeShip?: boolean,
}
const css = createCss(styles);

function CardPrice({ imgUrl, price, titleProd, description, freeShip }: props) {
  const [isOnMove, setEnter] = useState<boolean>(false);
  const y = useRef<number>(1);
  const x = useRef<number>(1);
  const card = useRef<HTMLDivElement>();
  const RAF_ID = useRef<number>();
  const previousTime = useRef<number>();
  const DEG = 35;

  const prevX = useRef<number>(1), prevY = useRef<number>(1);

  const animate = (time: number) => {
    // let delta = (time - previousTime.current) / 1000;
    if (!previousTime.current) {
      previousTime.current = time;
    }
    if (!isOnMove) {
      console.log("canceled 1 ")
      // console.log(`diffX abs = ${Math.abs(prevX.current - x.current)}`);
      if (Math.abs(prevX.current - x.current) < 0.05) {
        console.log("Cancell 2")
        console.log("last state ")
        prevX.current = 0;
        prevY.current = 0;
        cancelAnimationFrame(RAF_ID.current);
        return;
      }
    }
    // Rotation with Lerp ( A/2 + B/2 )
    prevX.current = (prevX.current + (x.current - prevX.current) * 0.075);// static 15%
    prevY.current = (prevY.current + (y.current - prevY.current) * 0.075);
    const rotX = ((prevY.current / window.innerHeight) * -2) + 1;// 0.012 deg 
    const rotY = ((prevX.current / window.innerWidth) * 2) - 1;
    card.current.style.setProperty("--rotX", `${rotX}`)
    card.current.style.setProperty("--rotY", `${rotY}`)

    // Light on the card 
    const rectCard = card.current.getBoundingClientRect();
    const lightX = x.current - rectCard.left;
    const lightY = y.current - rectCard.top;
    card.current.style.setProperty("--mouseX", `${lightX}px`)
    card.current.style.setProperty("--mouseY", `${lightY}px`)

    // Shadow
    const halfHeight = rectCard.height / 2;// 163 ---326
    const halfWidth = rectCard.width / 2;// 95 ---- 190
    const shadowY = (halfHeight - lightY) / 100;
    const shadowX = (halfWidth - lightX) / 100;
    card.current.style.setProperty("--x-shadow", `${shadowX * 7}px`)
    card.current.style.setProperty("--y-shadow", `${shadowY * 7}px`)

    RAF_ID.current = requestAnimationFrame(animate);
    previousTime.current = time;
  }
  // USE_EFFECT
  useEffect(() => {
    //console.count("useEfect ");

    RAF_ID.current = requestAnimationFrame(animate);

    return () => {
      // console.log("cleanUp")
      // cancelAnimationFrame(RAF_ID.current);
      // setTimeout(() => {
      //   console.log("cleanUp")
      cancelAnimationFrame(RAF_ID.current);

      // }, 2000);

    }
  }, [isOnMove]);

  function onMouseMove(event: any) {
    const e = event.touches ? event.touches[0] : event;

    if (!isOnMove) {
      prevX.current = e.clientX + 0.5;
      prevY.current = e.clientY + 0.5;
      //console.log(` x-m: ${e.clientX} x-y: ${e.clientY}`)
      setEnter(true);
      return;
    }
    x.current = e.clientX;
    y.current = e.clientY;

  }

  function onMouseLeave(e: any) {
    //todo: reset function
    // console.log(`leave ${isOnMove}`)
    if (isOnMove) {
      // x.current = 1;
      // y.current = -1;

      setEnter(false);
    }
  }

  return (
    <div className={css("card")}
      ref={card}
      onPointerMove={onMouseMove}
      onPointerLeave={onMouseLeave}>
      <div className={css('card__title')}
      >{titleProd ?? ""}</div>
      <img className={css('card__img')}
        src={imgUrl} alt="red shoes" />
      <div className={css("card__content")}>
        <span>${price}</span>
        <span>
          {freeShip ? "Envío gratis !" : ""}
        </span>
        <p className={css('card__paragraph')}>
          {description ?
            description :
            "Lorem ipsum Lorem ipsum lroemasdomsadomsad asdsd"}
        </p>
      </div>
    </div >
  )
}
export default CardPrice;