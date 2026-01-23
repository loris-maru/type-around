import Image from "next/image";

export default function StudioProfile() {
  return (
    <div
      className="relative w-[90%] px-24 mt-32 mb-[38vh] flex flex-row gap-x-12"
      id="about"
    >
      <div className="relative w-1/3 h-full border border-black rounded-lg shadow-button overflow-hidden">
        <Image
          src="/mock/profile/studio_profile_01.png"
          alt="Studio Profile"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative w-2/3">
        <header className="relative flex flex-row justify-between items-center gap-2">
          <div>5 familes</div>
          <div>100 fonts</div>
          <div>Latin + Hangul</div>
        </header>
        <div className="relative w-full h-px bg-neutral-300 my-4" />
        <p className="relative font-whisper text-xl font-normal leading-relaxed">
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
