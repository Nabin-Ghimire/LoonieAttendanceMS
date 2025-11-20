import { checkSchema } from 'express-validator';

export default checkSchema(
  {
    q: {
      trim: true,
      customSanitizer: {
        options: (value) => {
          return value ? value : '';
        },
      },
    },
    role: {
      customSanitizer: {
        options: (value) => {
          return value ? value : '';
        },
      },
    },
    currentPage: {
      customSanitizer: {
        options: (value) => {
          // '2', 'undefined', 'sdlfhhdf' =>NaN
          const parsedValue = value
          return parsedValue ? parsedValue : 1;
        },
      },
    },
    perPage: {
      customSanitizer: {
        options: (value) => {
          // '2', 'undefined', 'sdlfhhdf' =>NaN
          const parsedValue = value;
          return parsedValue ? parsedValue : 6;
        },
      },
    },
  },
  ['query'],
); //This ['query'] will fetch the value from the request URL's params/query(query tells parameters are in query.)
