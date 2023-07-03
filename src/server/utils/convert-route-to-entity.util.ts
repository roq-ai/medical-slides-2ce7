const mapping: Record<string, string> = {
  organizations: 'organization',
  polls: 'poll',
  presentations: 'presentation',
  responses: 'response',
  slides: 'slide',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
