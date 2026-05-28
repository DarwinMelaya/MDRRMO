import { renderToStaticMarkup } from "react-dom/server";
import {
  FaBolt,
  FaCarBurst,
  FaCircleDot,
  FaFire,
  FaTruckMedical,
  FaUserShield,
  FaWater,
} from "react-icons/fa6";
import { DEFAULT_REPORT_TYPE } from "./reportTypes";

export const REPORT_TYPE_ICON_COMPONENTS = {
  medical_emergency: FaTruckMedical,
  fire_hazard: FaFire,
  crime_security: FaUserShield,
  traffic_incident: FaCarBurst,
  utilities: FaBolt,
  disaster: FaWater,
  other: FaCircleDot,
};

export const ReportTypeIcon = ({
  type,
  className = "h-4 w-4 shrink-0",
}) => {
  const Icon =
    REPORT_TYPE_ICON_COMPONENTS[type] ??
    REPORT_TYPE_ICON_COMPONENTS[DEFAULT_REPORT_TYPE];
  return <Icon className={className} aria-hidden />;
};

export const reportTypeIconMarkup = (
  type,
  className = "report-pin__icon-svg",
) => {
  const Icon =
    REPORT_TYPE_ICON_COMPONENTS[type] ??
    REPORT_TYPE_ICON_COMPONENTS[DEFAULT_REPORT_TYPE];
  return renderToStaticMarkup(<Icon className={className} aria-hidden />);
};
