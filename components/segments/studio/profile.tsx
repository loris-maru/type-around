import Image from "next/image";

export default function StudioProfile() {
  return (
    <div
      className="relative mt-32 mb-[38vh] flex w-[90%] flex-row gap-x-12 px-24"
      id="about"
    >
      <div className="relative h-full w-1/3 overflow-hidden rounded-lg border border-black shadow-button">
        <Image
          src="/mock/profile/studio_profile_01.png"
          alt="Studio Profile"
          width={900}
          height={900}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative w-2/3">
        <header className="relative flex flex-row items-center justify-between gap-2">
          <div>5 familes</div>
          <div>100 fonts</div>
          <div>Latin + Hangul</div>
        </header>
        <div className="relative my-4 h-px w-full bg-neutral-300" />
        <p className="relative font-normal font-whisper text-xl leading-relaxed">
          Ultrices vitae molestie a phasellus duis sapien
          phasellus sapien sagittis velit vivamus lobortis
          vulputate. Lorem ipsum dolor sit amet aliquet
          sapien nullam purus lectus convallis tempus
          lobortis massa. Purus diam dictumst fusce dui
          tempor fames euismod massa. Netus vel molestie
          arcu lacinia posuere sed habitasse aliqua. Integer
          orci justo incididunt rhoncus odio. Tempus at
          iaculis pellentesque tellus auctor elementum urna.
        </p>
      </div>
    </div>
  );
}
