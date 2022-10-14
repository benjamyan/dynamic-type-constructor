export type BuildTuple<
	L extends number,
	S extends string | any = any,
	T extends any[] = []
> = T extends { length: L } ? T : BuildTuple<L, S, [...T, S]>;

export type Length<T extends any[] | string> = (
    T extends string
        ? Length<Split<T, ''>>
        : T extends { length: infer L }
            ? L extends number
                ? L : never
	        : never
);

export type Subtract<A extends number, B extends number> = (
	BuildTuple<A> extends [...infer U, ...BuildTuple<B> ]
		? Length<U> 
		: false
);

export type Add<A extends number, B extends number> = (
	Length<[...BuildTuple<A>, ...BuildTuple<B>]>
);

export type Split<
	S extends string,
	D extends string
> = (
	S extends `${infer Head}${D}${infer Tail}`
		? [Head, ...Split<Tail, D>]
		: S extends D ? [] : [S]
);

export type Join<
	Strings extends string[],
	Delimiter extends string
> = (
	Strings extends [string]
		? `${Strings[0]}`
		: Strings extends [string, ...infer Rest]
			? 	/// @ts-expect-error
				`${Strings[0]}${Delimiter}${Join<Rest, Delimiter>}`
			: ''
);

export type JoinFromToIndex<
	GivenStrings extends string[],
	Tolerance extends [number, number],
	Delimeter extends number = 0,
	InitFlag extends boolean = false, // Flag determining if we should start adding items to the accumulator
	Accumulator extends string[] = []
> = (
	Delimeter extends Tolerance[1]
		? Join<[...Accumulator, GivenStrings[Delimeter]], ''>
		: Delimeter extends Tolerance[0]
			? 	JoinFromToIndex<
					GivenStrings,
					Tolerance,
					Add<Delimeter, 1>,
					true,
					[...Accumulator, GivenStrings[Delimeter]]
				>
			: 	JoinFromToIndex<
					GivenStrings,
					Tolerance,
					Add<Delimeter, 1>,
					InitFlag,
					InitFlag extends true
						? [...Accumulator, GivenStrings[Delimeter]]
						: Accumulator
				>
);

export type UnionToIntersection<U> = (
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
);

export type FlattenAccumulator<T> = (
    T extends Array<infer U>
        ? FlattenAccumulator<U>
        :   /// @ts-expect-error
            {
                [K in keyof T as T[K] extends any ? K : never]: Extract<T[K], any>;
            }[keyof T]
);
