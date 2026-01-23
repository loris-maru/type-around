import { TYPE_STATUS } from "@/mock-data/type-status";
import SingleItem from "./single-item";

export default function TypefaceStatus() {
  return (
    <div className="relative flex flex-row gap-10 w-full px-[12vw] my-[20vh]">
      <div className="relative w-1/2 flex flex-col">
        <h3 className="font-ortank text-2xl font-black text-black">
          Status
        </h3>
        <p className="font-whisper text-base font-normal text-black leading-normal">
          Ultrices vitae molestie a phasellus duis sapien
          phasellus sapien sagittis velit vivamus lobortis
          vulputate. Lorem ipsum dolor sit amet aliquet
          sapien nullam purus lectus convallis tempus
          lobortis massa.
        </p>
      </div>
      <div className="relative grid grid-cols-3 gap-2 w-1/2">
        {TYPE_STATUS.map((item) => (
          <SingleItem
            key={item.label}
            label={item.label}
            value={item.value}
            max={item.max}
          />
        ))}
      </div>
    </div>
  );
}
