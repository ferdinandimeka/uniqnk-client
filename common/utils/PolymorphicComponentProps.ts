export type NoInfer<T> = [T][T extends any ? 0 : never];

export type PolymorphicComponentProps<
  C extends React.ElementType, // Base component type
  Props = object, // Other props for the generic component
  Exclude = object // Properties of the base component type that will be handled by this generic component
> = React.PropsWithChildren<
  Props & {
    as?: C;
  }
> &
  Omit<
    React.ComponentPropsWithoutRef<C>,
    keyof ({
      as?: C;
    } & Props &
      Exclude)
  >;
