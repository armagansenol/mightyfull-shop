import { graphql } from 'msw';

export const handlers = [
  graphql.operation(() => {
    return undefined;
  })
];
