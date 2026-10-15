// Utilidades de i18n dos geradores: prefixo /en/ nos links internos e texto puro p/ JSON-LD.
export const withLocaleLinks = (markdown, locale) =>
  locale === 'pt' ? markdown : markdown.replace(/\]\(\/(?!en\/|_|favicon)/g, '](/en/');

export const plainText = (markdown) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
