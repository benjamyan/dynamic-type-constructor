import { JoinFromToIndex, Join, Split, Add, Subtract, Length, BuildTuple, UnionToIntersection, FlattenAccumulator } from './types/utils';
import { UnitFnState, NullChar } from './types/definitions';
import { AllTypes } from '.';

type ParseMatchByArray<
	S extends string[],
	Delimeter extends number = 0,
	Accumulator extends any[] = []
> = (
	Delimeter extends Length<S>
		? Accumulator
		: S[Delimeter] extends NullChar
			? ParseMatchByArray<S, Add<Delimeter, 1>, Accumulator>
			: S[Delimeter] extends keyof AllTypes
				? ParseMatchByArray<
					S,
					Add<Delimeter, 1>,
					[...Accumulator, Record<S[Delimeter], AllTypes[S[Delimeter]]>]
				>
				: ParseMatchByArray<S, Add<Delimeter, 1>, Accumulator>
	);
                
type BuildNewUnit<
	Unit extends string[],
	Result extends Array<Record<string, any>>,
	Tolerance extends [number, number],
	CurrentIndex extends number = 0
> = (
	CurrentIndex extends Length<Result>
		? Join<Unit, ''>
		: keyof Result[CurrentIndex] extends infer Current
			? Current extends string
				? [
					Tolerance[0] extends 0 ? 0 : Subtract<Tolerance[0], 1>,
					Add<Tolerance[0], Length<Current>>
				] extends infer NewTol
					? NewTol extends [number, number]
						? BuildNewUnit<
							Split<
								Tolerance[0] extends 0
								? `${Join<BuildTuple<Length<Current>, NullChar>,''>}${JoinFromToIndex<Unit, [NewTol[1], Length<Unit>]>}`
								: `${JoinFromToIndex<Unit, [0, NewTol[0]]>}${Join<BuildTuple<Length<Current>, NullChar>,''>}${JoinFromToIndex<Unit, [NewTol[1], Length<Unit>]>}`,''
							>,
							Result,
							[Length<Current>, Tolerance[1]],
							Add<CurrentIndex, 1>
						>
						: never
					: never
				: never
			: never
	);

type GetDynamicUnitAssignmentState<
	State extends UnitFnState,
	Tolerance extends [number, number],
	Len extends number
> = (
		State extends 'FRWD'
			? Tolerance[1] extends 0 ? 'IND' : 'FRWD'
			: State extends 'IND'
				? Subtract<Len, Tolerance[1]> extends false ? 'DONE' : 'IND'
				: 'DONE'
	);

export type DynamicUnitAssignment<
	GivenUnit extends string,
	Tolerance extends [number, number] = [0, 0],
	Accumulator extends any[] = [],
	State extends UnitFnState = 'INIT',
	SplitS extends string[] = Split<GivenUnit, ''>,
	Curr extends string = JoinFromToIndex<SplitS, Tolerance>
> = (
	Length<SplitS> extends 0
		? null
		: State extends 'INIT'
			? DynamicUnitAssignment<GivenUnit, [0, Length<SplitS>], [], 'FRWD'>
			: State extends 'DONE'
				? UnionToIntersection<FlattenAccumulator<Accumulator>>
				: ParseMatchByArray<[Curr]> extends infer Result
					? Result extends any[]
						? Length<Result> extends 0
							? 	DynamicUnitAssignment<
									GivenUnit,
									( State extends 'FRWD'
										? Tolerance[0] extends Length<SplitS>
											? [
												0,
												Subtract<Tolerance[1], 1> extends infer T
													? T extends number ? T : 0
													: never
											]
											: [Add<Tolerance[0], 1>, Tolerance[1]]
										: State extends 'IND'
											? Tolerance[1] extends Length<SplitS>
												? [Add<Tolerance[0], 1>, Add<Tolerance[0], 2>]
												: [Tolerance[0], Add<Tolerance[1], 1>]
											: [0, 1]
									),
									Accumulator,
									GetDynamicUnitAssignmentState<State, Tolerance, Length<SplitS>>
								>
							: 	DynamicUnitAssignment<
									BuildNewUnit<SplitS, Result, Tolerance>,
									( State extends 'FRWD'
										? [0, Subtract<Tolerance[1], Length<Curr>> extends infer T ? T extends number ? T : 0 : never]
										: State extends 'IND'
											? Add<Tolerance[0], Length<Curr>> extends infer New
												? New extends number ? [New, Add<New, 1>] : [0, 1]
												: [0, 1]
											: [0, 1]
									),
									[...Accumulator, ...Result],
									GetDynamicUnitAssignmentState<State, Tolerance, Length<SplitS>>
								>
						: never
					: never
	);

