export type TrpcContext = {
  req: Request;
};

export function createContext(opts: { req: Request }): TrpcContext {
  return { req: opts.req };
}
