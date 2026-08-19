import type { IconType } from "react-icons";
import {
  FaBalanceScale,
  FaBriefcase,
  FaBuilding,
  FaBullhorn,
  FaCarSide,
  FaFileAlt,
  FaGraduationCap,
  FaHeart,
  FaHome,
  FaIdCard,
  FaLeaf,
  FaSearch,
} from "react-icons/fa";

const icons: Record<string, IconType> = {
  name: FaIdCard,
  heart: FaHeart,
  home: FaHome,
  car: FaCarSide,
  briefcase: FaBriefcase,
  bag: FaBuilding,
  candle: FaLeaf,
  search: FaSearch,
  scale: FaBalanceScale,
  book: FaGraduationCap,
  megaphone: FaBullhorn,
  doc: FaFileAlt,
};

export function CategoryIcon({
  name,
  className = "h-7 w-7",
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? FaFileAlt;
  return <Icon className={className} aria-hidden />;
}
