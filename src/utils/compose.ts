const compose =
  (...funcs: Function[]) =>
  (comp: any) => {
    return funcs.reduceRight((wrapped, f) => f(wrapped), comp);
  };

export default compose;
