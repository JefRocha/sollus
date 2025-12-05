// This file extends the Express namespace to add custom properties to the Request object
// It specifically augments the User interface provided by @types/passport

declare namespace Express {
  // Augment the existing User interface from @types/passport
  export interface User {
    sub: string;
    tenant?: number;
  }
}