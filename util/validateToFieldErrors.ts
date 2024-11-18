import {
  type InferType,
  Schema as YupSchema,
  ValidationError as YupValidationError,
} from 'yup';

type ConcatPaths<
  Prefix extends string,
  Key extends string,
> = `${Prefix}${Prefix extends '' ? '' : '.'}${Key}`;

type NestedPropertyPaths<ObjectType, PathPrefix extends string = ''> = {
  [PropertyKey in keyof ObjectType]: ObjectType[PropertyKey] extends object
    ? NestedPropertyPaths<
        ObjectType[PropertyKey],
        ConcatPaths<PathPrefix, Extract<PropertyKey, string>>
      >
    : ConcatPaths<PathPrefix, Extract<PropertyKey, string>>;
}[keyof ObjectType];

type FieldError<Schema extends YupSchema> = [
  fieldName: NestedPropertyPaths<InferType<Schema>>,
  message: string,
];

export type ValidationError<Schema extends YupSchema> = {
  message: string;
  fieldErrors?: FieldError<Schema>[];
};

export async function validateToFieldErrors<Schema extends YupSchema>(
  schema: Schema,
  data: unknown,
): Promise<
  | {
      data: InferType<Schema>;
    }
  | {
      fieldErrors: FieldError<Schema>[];
    }
> {
  try {
    return {
      data: await schema.validate(data, {
        // Validate data exhaustively (return all errors)
        abortEarly: false,
        // Do not cast or transform data
        strict: true,
      }),
    };
  } catch (error) {
    if (!('inner' in (error as Record<string, unknown>))) {
      throw error;
    }

    // Return array of all errors that occurred when using
    // abortEarly: false
    // https://github.com/jquense/yup#:~:text=alternatively%2C%20errors%20will%20have%20all%20of%20the%20messages%20from%20each%20inner%20error.
    return {
      fieldErrors: (error as YupValidationError).inner.map((innerError) => {
        if (!innerError.path) {
          throw new Error(
            `field path is falsy for error message "${innerError.message}"`,
          );
        }

        return [
          innerError.path as NestedPropertyPaths<InferType<Schema>>,
          innerError.message,
        ];
      }),
    };
  }
}
