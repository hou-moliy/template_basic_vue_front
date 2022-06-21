import defaultSettings from '@/settings';

const title = defaultSettings.title || '管理平台模板';

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
