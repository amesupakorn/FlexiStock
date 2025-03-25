
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tracking
 * 
 */
export type Tracking = $Result.DefaultSelection<Prisma.$TrackingPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TrackingStatus: {
  Processing: 'Processing',
  InTransit: 'InTransit',
  Delivered: 'Delivered',
  Delayed: 'Delayed'
};

export type TrackingStatus = (typeof TrackingStatus)[keyof typeof TrackingStatus]

}

export type TrackingStatus = $Enums.TrackingStatus

export const TrackingStatus: typeof $Enums.TrackingStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Trackings
 * const trackings = await prisma.tracking.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Trackings
   * const trackings = await prisma.tracking.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tracking`: Exposes CRUD operations for the **Tracking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Trackings
    * const trackings = await prisma.tracking.findMany()
    * ```
    */
  get tracking(): Prisma.TrackingDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.5.0
   * Query Engine version: 173f8d54f8d52e692c7e27e72a88314ec7aeff60
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tracking: 'Tracking'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tracking"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tracking: {
        payload: Prisma.$TrackingPayload<ExtArgs>
        fields: Prisma.TrackingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>
          }
          findFirst: {
            args: Prisma.TrackingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>
          }
          findMany: {
            args: Prisma.TrackingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>[]
          }
          create: {
            args: Prisma.TrackingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>
          }
          createMany: {
            args: Prisma.TrackingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>[]
          }
          delete: {
            args: Prisma.TrackingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>
          }
          update: {
            args: Prisma.TrackingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>
          }
          deleteMany: {
            args: Prisma.TrackingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrackingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>[]
          }
          upsert: {
            args: Prisma.TrackingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackingPayload>
          }
          aggregate: {
            args: Prisma.TrackingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTracking>
          }
          groupBy: {
            args: Prisma.TrackingGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackingGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackingCountArgs<ExtArgs>
            result: $Utils.Optional<TrackingCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tracking?: TrackingOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model Tracking
   */

  export type AggregateTracking = {
    _count: TrackingCountAggregateOutputType | null
    _min: TrackingMinAggregateOutputType | null
    _max: TrackingMaxAggregateOutputType | null
  }

  export type TrackingMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    status: $Enums.TrackingStatus | null
    location: string | null
    updatedAt: Date | null
    delayReason: string | null
  }

  export type TrackingMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    status: $Enums.TrackingStatus | null
    location: string | null
    updatedAt: Date | null
    delayReason: string | null
  }

  export type TrackingCountAggregateOutputType = {
    id: number
    orderId: number
    status: number
    location: number
    updatedAt: number
    delayReason: number
    _all: number
  }


  export type TrackingMinAggregateInputType = {
    id?: true
    orderId?: true
    status?: true
    location?: true
    updatedAt?: true
    delayReason?: true
  }

  export type TrackingMaxAggregateInputType = {
    id?: true
    orderId?: true
    status?: true
    location?: true
    updatedAt?: true
    delayReason?: true
  }

  export type TrackingCountAggregateInputType = {
    id?: true
    orderId?: true
    status?: true
    location?: true
    updatedAt?: true
    delayReason?: true
    _all?: true
  }

  export type TrackingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tracking to aggregate.
     */
    where?: TrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trackings to fetch.
     */
    orderBy?: TrackingOrderByWithRelationInput | TrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Trackings
    **/
    _count?: true | TrackingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackingMaxAggregateInputType
  }

  export type GetTrackingAggregateType<T extends TrackingAggregateArgs> = {
        [P in keyof T & keyof AggregateTracking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTracking[P]>
      : GetScalarType<T[P], AggregateTracking[P]>
  }




  export type TrackingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackingWhereInput
    orderBy?: TrackingOrderByWithAggregationInput | TrackingOrderByWithAggregationInput[]
    by: TrackingScalarFieldEnum[] | TrackingScalarFieldEnum
    having?: TrackingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackingCountAggregateInputType | true
    _min?: TrackingMinAggregateInputType
    _max?: TrackingMaxAggregateInputType
  }

  export type TrackingGroupByOutputType = {
    id: string
    orderId: string
    status: $Enums.TrackingStatus
    location: string | null
    updatedAt: Date
    delayReason: string | null
    _count: TrackingCountAggregateOutputType | null
    _min: TrackingMinAggregateOutputType | null
    _max: TrackingMaxAggregateOutputType | null
  }

  type GetTrackingGroupByPayload<T extends TrackingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackingGroupByOutputType[P]>
            : GetScalarType<T[P], TrackingGroupByOutputType[P]>
        }
      >
    >


  export type TrackingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    status?: boolean
    location?: boolean
    updatedAt?: boolean
    delayReason?: boolean
  }, ExtArgs["result"]["tracking"]>

  export type TrackingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    status?: boolean
    location?: boolean
    updatedAt?: boolean
    delayReason?: boolean
  }, ExtArgs["result"]["tracking"]>

  export type TrackingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    status?: boolean
    location?: boolean
    updatedAt?: boolean
    delayReason?: boolean
  }, ExtArgs["result"]["tracking"]>

  export type TrackingSelectScalar = {
    id?: boolean
    orderId?: boolean
    status?: boolean
    location?: boolean
    updatedAt?: boolean
    delayReason?: boolean
  }

  export type TrackingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "status" | "location" | "updatedAt" | "delayReason", ExtArgs["result"]["tracking"]>

  export type $TrackingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tracking"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      status: $Enums.TrackingStatus
      location: string | null
      updatedAt: Date
      delayReason: string | null
    }, ExtArgs["result"]["tracking"]>
    composites: {}
  }

  type TrackingGetPayload<S extends boolean | null | undefined | TrackingDefaultArgs> = $Result.GetResult<Prisma.$TrackingPayload, S>

  type TrackingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrackingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrackingCountAggregateInputType | true
    }

  export interface TrackingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tracking'], meta: { name: 'Tracking' } }
    /**
     * Find zero or one Tracking that matches the filter.
     * @param {TrackingFindUniqueArgs} args - Arguments to find a Tracking
     * @example
     * // Get one Tracking
     * const tracking = await prisma.tracking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackingFindUniqueArgs>(args: SelectSubset<T, TrackingFindUniqueArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tracking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrackingFindUniqueOrThrowArgs} args - Arguments to find a Tracking
     * @example
     * // Get one Tracking
     * const tracking = await prisma.tracking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackingFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tracking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingFindFirstArgs} args - Arguments to find a Tracking
     * @example
     * // Get one Tracking
     * const tracking = await prisma.tracking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackingFindFirstArgs>(args?: SelectSubset<T, TrackingFindFirstArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tracking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingFindFirstOrThrowArgs} args - Arguments to find a Tracking
     * @example
     * // Get one Tracking
     * const tracking = await prisma.tracking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackingFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackingFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Trackings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Trackings
     * const trackings = await prisma.tracking.findMany()
     * 
     * // Get first 10 Trackings
     * const trackings = await prisma.tracking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackingWithIdOnly = await prisma.tracking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackingFindManyArgs>(args?: SelectSubset<T, TrackingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tracking.
     * @param {TrackingCreateArgs} args - Arguments to create a Tracking.
     * @example
     * // Create one Tracking
     * const Tracking = await prisma.tracking.create({
     *   data: {
     *     // ... data to create a Tracking
     *   }
     * })
     * 
     */
    create<T extends TrackingCreateArgs>(args: SelectSubset<T, TrackingCreateArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Trackings.
     * @param {TrackingCreateManyArgs} args - Arguments to create many Trackings.
     * @example
     * // Create many Trackings
     * const tracking = await prisma.tracking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackingCreateManyArgs>(args?: SelectSubset<T, TrackingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Trackings and returns the data saved in the database.
     * @param {TrackingCreateManyAndReturnArgs} args - Arguments to create many Trackings.
     * @example
     * // Create many Trackings
     * const tracking = await prisma.tracking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Trackings and only return the `id`
     * const trackingWithIdOnly = await prisma.tracking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackingCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tracking.
     * @param {TrackingDeleteArgs} args - Arguments to delete one Tracking.
     * @example
     * // Delete one Tracking
     * const Tracking = await prisma.tracking.delete({
     *   where: {
     *     // ... filter to delete one Tracking
     *   }
     * })
     * 
     */
    delete<T extends TrackingDeleteArgs>(args: SelectSubset<T, TrackingDeleteArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tracking.
     * @param {TrackingUpdateArgs} args - Arguments to update one Tracking.
     * @example
     * // Update one Tracking
     * const tracking = await prisma.tracking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackingUpdateArgs>(args: SelectSubset<T, TrackingUpdateArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Trackings.
     * @param {TrackingDeleteManyArgs} args - Arguments to filter Trackings to delete.
     * @example
     * // Delete a few Trackings
     * const { count } = await prisma.tracking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackingDeleteManyArgs>(args?: SelectSubset<T, TrackingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Trackings
     * const tracking = await prisma.tracking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackingUpdateManyArgs>(args: SelectSubset<T, TrackingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Trackings and returns the data updated in the database.
     * @param {TrackingUpdateManyAndReturnArgs} args - Arguments to update many Trackings.
     * @example
     * // Update many Trackings
     * const tracking = await prisma.tracking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Trackings and only return the `id`
     * const trackingWithIdOnly = await prisma.tracking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrackingUpdateManyAndReturnArgs>(args: SelectSubset<T, TrackingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tracking.
     * @param {TrackingUpsertArgs} args - Arguments to update or create a Tracking.
     * @example
     * // Update or create a Tracking
     * const tracking = await prisma.tracking.upsert({
     *   create: {
     *     // ... data to create a Tracking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tracking we want to update
     *   }
     * })
     */
    upsert<T extends TrackingUpsertArgs>(args: SelectSubset<T, TrackingUpsertArgs<ExtArgs>>): Prisma__TrackingClient<$Result.GetResult<Prisma.$TrackingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Trackings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingCountArgs} args - Arguments to filter Trackings to count.
     * @example
     * // Count the number of Trackings
     * const count = await prisma.tracking.count({
     *   where: {
     *     // ... the filter for the Trackings we want to count
     *   }
     * })
    **/
    count<T extends TrackingCountArgs>(
      args?: Subset<T, TrackingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrackingAggregateArgs>(args: Subset<T, TrackingAggregateArgs>): Prisma.PrismaPromise<GetTrackingAggregateType<T>>

    /**
     * Group by Tracking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrackingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackingGroupByArgs['orderBy'] }
        : { orderBy?: TrackingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrackingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tracking model
   */
  readonly fields: TrackingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tracking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tracking model
   */ 
  interface TrackingFieldRefs {
    readonly id: FieldRef<"Tracking", 'String'>
    readonly orderId: FieldRef<"Tracking", 'String'>
    readonly status: FieldRef<"Tracking", 'TrackingStatus'>
    readonly location: FieldRef<"Tracking", 'String'>
    readonly updatedAt: FieldRef<"Tracking", 'DateTime'>
    readonly delayReason: FieldRef<"Tracking", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Tracking findUnique
   */
  export type TrackingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * Filter, which Tracking to fetch.
     */
    where: TrackingWhereUniqueInput
  }

  /**
   * Tracking findUniqueOrThrow
   */
  export type TrackingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * Filter, which Tracking to fetch.
     */
    where: TrackingWhereUniqueInput
  }

  /**
   * Tracking findFirst
   */
  export type TrackingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * Filter, which Tracking to fetch.
     */
    where?: TrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trackings to fetch.
     */
    orderBy?: TrackingOrderByWithRelationInput | TrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trackings.
     */
    cursor?: TrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trackings.
     */
    distinct?: TrackingScalarFieldEnum | TrackingScalarFieldEnum[]
  }

  /**
   * Tracking findFirstOrThrow
   */
  export type TrackingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * Filter, which Tracking to fetch.
     */
    where?: TrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trackings to fetch.
     */
    orderBy?: TrackingOrderByWithRelationInput | TrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Trackings.
     */
    cursor?: TrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trackings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Trackings.
     */
    distinct?: TrackingScalarFieldEnum | TrackingScalarFieldEnum[]
  }

  /**
   * Tracking findMany
   */
  export type TrackingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * Filter, which Trackings to fetch.
     */
    where?: TrackingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Trackings to fetch.
     */
    orderBy?: TrackingOrderByWithRelationInput | TrackingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Trackings.
     */
    cursor?: TrackingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Trackings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Trackings.
     */
    skip?: number
    distinct?: TrackingScalarFieldEnum | TrackingScalarFieldEnum[]
  }

  /**
   * Tracking create
   */
  export type TrackingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * The data needed to create a Tracking.
     */
    data: XOR<TrackingCreateInput, TrackingUncheckedCreateInput>
  }

  /**
   * Tracking createMany
   */
  export type TrackingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Trackings.
     */
    data: TrackingCreateManyInput | TrackingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tracking createManyAndReturn
   */
  export type TrackingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * The data used to create many Trackings.
     */
    data: TrackingCreateManyInput | TrackingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tracking update
   */
  export type TrackingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * The data needed to update a Tracking.
     */
    data: XOR<TrackingUpdateInput, TrackingUncheckedUpdateInput>
    /**
     * Choose, which Tracking to update.
     */
    where: TrackingWhereUniqueInput
  }

  /**
   * Tracking updateMany
   */
  export type TrackingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Trackings.
     */
    data: XOR<TrackingUpdateManyMutationInput, TrackingUncheckedUpdateManyInput>
    /**
     * Filter which Trackings to update
     */
    where?: TrackingWhereInput
    /**
     * Limit how many Trackings to update.
     */
    limit?: number
  }

  /**
   * Tracking updateManyAndReturn
   */
  export type TrackingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * The data used to update Trackings.
     */
    data: XOR<TrackingUpdateManyMutationInput, TrackingUncheckedUpdateManyInput>
    /**
     * Filter which Trackings to update
     */
    where?: TrackingWhereInput
    /**
     * Limit how many Trackings to update.
     */
    limit?: number
  }

  /**
   * Tracking upsert
   */
  export type TrackingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * The filter to search for the Tracking to update in case it exists.
     */
    where: TrackingWhereUniqueInput
    /**
     * In case the Tracking found by the `where` argument doesn't exist, create a new Tracking with this data.
     */
    create: XOR<TrackingCreateInput, TrackingUncheckedCreateInput>
    /**
     * In case the Tracking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackingUpdateInput, TrackingUncheckedUpdateInput>
  }

  /**
   * Tracking delete
   */
  export type TrackingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
    /**
     * Filter which Tracking to delete.
     */
    where: TrackingWhereUniqueInput
  }

  /**
   * Tracking deleteMany
   */
  export type TrackingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trackings to delete
     */
    where?: TrackingWhereInput
    /**
     * Limit how many Trackings to delete.
     */
    limit?: number
  }

  /**
   * Tracking without action
   */
  export type TrackingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tracking
     */
    select?: TrackingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tracking
     */
    omit?: TrackingOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TrackingScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    status: 'status',
    location: 'location',
    updatedAt: 'updatedAt',
    delayReason: 'delayReason'
  };

  export type TrackingScalarFieldEnum = (typeof TrackingScalarFieldEnum)[keyof typeof TrackingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'TrackingStatus'
   */
  export type EnumTrackingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrackingStatus'>
    


  /**
   * Reference to a field of type 'TrackingStatus[]'
   */
  export type ListEnumTrackingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TrackingStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TrackingWhereInput = {
    AND?: TrackingWhereInput | TrackingWhereInput[]
    OR?: TrackingWhereInput[]
    NOT?: TrackingWhereInput | TrackingWhereInput[]
    id?: StringFilter<"Tracking"> | string
    orderId?: StringFilter<"Tracking"> | string
    status?: EnumTrackingStatusFilter<"Tracking"> | $Enums.TrackingStatus
    location?: StringNullableFilter<"Tracking"> | string | null
    updatedAt?: DateTimeFilter<"Tracking"> | Date | string
    delayReason?: StringNullableFilter<"Tracking"> | string | null
  }

  export type TrackingOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    delayReason?: SortOrderInput | SortOrder
  }

  export type TrackingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrackingWhereInput | TrackingWhereInput[]
    OR?: TrackingWhereInput[]
    NOT?: TrackingWhereInput | TrackingWhereInput[]
    orderId?: StringFilter<"Tracking"> | string
    status?: EnumTrackingStatusFilter<"Tracking"> | $Enums.TrackingStatus
    location?: StringNullableFilter<"Tracking"> | string | null
    updatedAt?: DateTimeFilter<"Tracking"> | Date | string
    delayReason?: StringNullableFilter<"Tracking"> | string | null
  }, "id">

  export type TrackingOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    delayReason?: SortOrderInput | SortOrder
    _count?: TrackingCountOrderByAggregateInput
    _max?: TrackingMaxOrderByAggregateInput
    _min?: TrackingMinOrderByAggregateInput
  }

  export type TrackingScalarWhereWithAggregatesInput = {
    AND?: TrackingScalarWhereWithAggregatesInput | TrackingScalarWhereWithAggregatesInput[]
    OR?: TrackingScalarWhereWithAggregatesInput[]
    NOT?: TrackingScalarWhereWithAggregatesInput | TrackingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tracking"> | string
    orderId?: StringWithAggregatesFilter<"Tracking"> | string
    status?: EnumTrackingStatusWithAggregatesFilter<"Tracking"> | $Enums.TrackingStatus
    location?: StringNullableWithAggregatesFilter<"Tracking"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Tracking"> | Date | string
    delayReason?: StringNullableWithAggregatesFilter<"Tracking"> | string | null
  }

  export type TrackingCreateInput = {
    id?: string
    orderId: string
    status: $Enums.TrackingStatus
    location?: string | null
    updatedAt?: Date | string
    delayReason?: string | null
  }

  export type TrackingUncheckedCreateInput = {
    id?: string
    orderId: string
    status: $Enums.TrackingStatus
    location?: string | null
    updatedAt?: Date | string
    delayReason?: string | null
  }

  export type TrackingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    delayReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TrackingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    delayReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TrackingCreateManyInput = {
    id?: string
    orderId: string
    status: $Enums.TrackingStatus
    location?: string | null
    updatedAt?: Date | string
    delayReason?: string | null
  }

  export type TrackingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    delayReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TrackingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTrackingStatusFieldUpdateOperationsInput | $Enums.TrackingStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    delayReason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumTrackingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusFilter<$PrismaModel> | $Enums.TrackingStatus
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TrackingCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    location?: SortOrder
    updatedAt?: SortOrder
    delayReason?: SortOrder
  }

  export type TrackingMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    location?: SortOrder
    updatedAt?: SortOrder
    delayReason?: SortOrder
  }

  export type TrackingMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    status?: SortOrder
    location?: SortOrder
    updatedAt?: SortOrder
    delayReason?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumTrackingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrackingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrackingStatusFilter<$PrismaModel>
    _max?: NestedEnumTrackingStatusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumTrackingStatusFieldUpdateOperationsInput = {
    set?: $Enums.TrackingStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumTrackingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusFilter<$PrismaModel> | $Enums.TrackingStatus
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumTrackingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TrackingStatus | EnumTrackingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TrackingStatus[] | ListEnumTrackingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTrackingStatusWithAggregatesFilter<$PrismaModel> | $Enums.TrackingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTrackingStatusFilter<$PrismaModel>
    _max?: NestedEnumTrackingStatusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}