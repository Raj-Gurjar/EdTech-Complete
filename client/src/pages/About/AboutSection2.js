import React from "react";
import img1 from "../../assets/images/home-img-1.jpg";
import HighlightText from "../../user interfaces/HighlightText";

export default function AboutSection2() {
  return (
    <div className=" my-5 flex flex-col  mt-[100px] w-11/12 mx-auto justify-center flex-wrap gap-9">
      <div className="flex gap-[50px] flex-wrap">
        <div className="w-[45%] -mt-1">
          <h1 className="text-2xl font-bold mb-2">
            <HighlightText text={"Our Founding Story"} />
          </h1>

          <div className="text-[15px] text-white4 flex gap-y-2 flex-col justify-start">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni,
              similique animi quis quasi sapiente quibusdam autem soluta ad
              aperiam tempora maiores iste ea molestias voluptate iure nemo,
              repellat repellendus accusantium et corporis doloribus laudantium,
              nam quod? Tempora corporis impedit veniam quam, blanditiis
              necessitatibus facilis! Ratione nesciunt quia eius amet aperiam
              iure veritatis similique delectus temporibus perferendis excepturi
            </p>
            <p>
              mollitia accusantium tempora obcaecati ipsa culpa quam ullam
              asperiores voluptatum deserunt, expedita corporis. At molestiae
              dignissimos ea repellendus asperiores repudiandae numquam nesciunt
              aspernatur eos nostrum dolor quas soluta ipsum officia nam sunt,
              odio maiores a temporibus. Aliquam impedit laborum animi
              repellendus ad cumque.
            </p>
          </div>
        </div>

        <div className="w-[45%]">
          <img src={img1} alt="" className="w-auto h-[300px]" />
        </div>
      </div>

      <div className="flex gap-[50px] flex-wrap">
        <div className="w-[45%]">
          <h1 className="text-2xl font-bold mb-2">
            <HighlightText text={"Our Mission"} />
          </h1>

          <div className="text-[15px] text-white4 flex gap-y-2 flex-col justify-start">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni,
              similique animi quis quasi sapiente quibusdam autem soluta ad
              aperiam tempora maiores iste ea molestias voluptate iure nemo,
              repellat repellendus accusantium et corporis doloribus laudantium,
              nam quod? Tempora corporis impedit veniam quam, blanditiis
              necessitatibus facilis! Ratione nesciunt quia eius amet aperiam
              iure veritatis similique delectus temporibus perferendis excepturi
            </p>
          </div>
        </div>
        <div className="w-[45%]">
          <h1 className="text-2xl font-bold mb-2">
            <HighlightText text={"Our Vision"} />
          </h1>

          <div className="text-[15px] text-white4 flex gap-y-2 flex-col justify-start">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni,
              similique animi quis quasi sapiente quibusdam autem soluta ad
              aperiam tempora maiores iste ea molestias voluptate iure nemo,
              repellat repellendus accusantium et corporis doloribus laudantium,
              nam quod? Tempora corporis impedit veniam quam, blanditiis
              necessitatibus facilis! Ratione nesciunt quia eius amet aperiam
              iure veritatis similique delectus temporibus perferendis excepturi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
