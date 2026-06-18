const CLOUDINARY_BASE = 'https://res.cloudinary.com/dq6gr5zjc/image/upload';
const LOGO_ID = 'v1781796329/ChatGPT_Image_Jun_18_2026_08_55_14_PM_iztkqo';

export const BRAND_NAME = 'ERP Digital Solution';

/** Trimmed — removes empty padding around the logo artwork */
export const BRAND_LOGO_URL = `${CLOUDINARY_BASE}/e_trim,q_auto,f_auto/${LOGO_ID}.png`;

/** Header — crisp at nav bar size */
export const BRAND_LOGO_HEADER_URL = `${CLOUDINARY_BASE}/e_trim,h_120,c_fit,q_auto,f_auto/${LOGO_ID}.png`;

export const BRAND_ALT = BRAND_NAME;
