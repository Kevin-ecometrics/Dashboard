import Image from "next/image";

const Avatar = ({ src, className }) => (
  <div className={`rounded-full overflow-hidden ${className}`}>
    <Image
      src={src}
      alt="Avatar"
      width={96}
      height={96}
      className="w-full h-full object-cover"
    />
  </div>
);

export default Avatar;
