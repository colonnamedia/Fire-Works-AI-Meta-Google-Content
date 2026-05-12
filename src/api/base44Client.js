// Base44 removed — stub to prevent import errors
export const base44 = {
  auth: {
    me: () => Promise.resolve(null),
    redirectToLogin: () => {},
    updateMe: () => Promise.resolve(null),
  },
  entities: {},
  functions: {
    invoke: () => Promise.resolve({ data: {} }),
  },
};
