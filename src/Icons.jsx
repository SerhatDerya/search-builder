import {
  SiInstagram,
  SiReddit,
  SiYoutube,
  SiLinkedin,
  SiX,
  SiGithub,
  SiStackoverflow,
} from "react-icons/si";
import {
  HiOutlineGlobeAlt,
  HiOutlineDocument,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocument,
  HiOutlineDocumentText,
  HiOutlineTableCells,
  HiOutlinePresentationChartBar,
  HiOutlineClock,
  HiOutlineTrash,
  HiOutlineBookmark,
  HiOutlineXMark,
  HiOutlineFunnel,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineBookOpen,
} from "react-icons/hi2";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";

const iconClass = "w-5 h-5 shrink-0";

function withClass(IconComponent, defaultClassName = iconClass) {
  return function Icon({ className = defaultClassName, ...props }) {
    return <IconComponent className={className} {...props} />;
  };
}

export const IconInstagram = withClass(SiInstagram);
export const IconReddit = withClass(SiReddit);
export const IconYouTube = withClass(SiYoutube);
export const IconLinkedIn = withClass(SiLinkedin);
export const IconX = withClass(SiX);
export const IconGitHub = withClass(SiGithub);
export const IconStackOverflow = withClass(SiStackoverflow);

export const IconGlobe = withClass(HiOutlineGlobeAlt);
export const IconFile = withClass(HiOutlineDocument);
export const IconSearch = withClass(HiOutlineMagnifyingGlass);
export const IconCopy = withClass(HiOutlineClipboardDocument);
export const IconClock = withClass(HiOutlineClock);
export const IconTrash = withClass(HiOutlineTrash);
export const IconBookmark = withClass(HiOutlineBookmark);
export const IconXMark = withClass(HiOutlineXMark);
export const IconFunnel = withClass(HiOutlineFunnel);
export const IconChevronDown = withClass(HiOutlineChevronDown);
export const IconChevronUp = withClass(HiOutlineChevronUp);
export const IconBookOpen = withClass(HiOutlineBookOpen);

export const IconPdf = withClass(FaFilePdf);
export const IconDoc = withClass(FaFileWord);
export const IconSheet = withClass(FaFileExcel);
export const IconPresentation = withClass(FaFilePowerpoint);

const SITE_ICONS = {
  "instagram.com": IconInstagram,
  "reddit.com": IconReddit,
  "youtube.com": IconYouTube,
  "linkedin.com": IconLinkedIn,
  "x.com": IconX,
  "github.com": IconGitHub,
  "stackoverflow.com": IconStackOverflow,
};

export function SiteIcon({ domain, className = iconClass }) {
  const Icon = SITE_ICONS[domain] || IconGlobe;
  return <Icon className={className} />;
}
