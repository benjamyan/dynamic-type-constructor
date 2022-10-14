import { DynamicUnitAssignment } from './DynamicUnitAssignment';
import { Num22, Num60, Num6022, TypeBar, TypeBaz, TypeFoo, TypeFooBar } from './types/definitions';

export type AllTypes = {
	'22': Num22;
	'60': Num60;
	'6022': Num6022;
	Foo: TypeFoo;
	Bar: TypeBar;
	FooBar: TypeFooBar;
	Baz: TypeBaz;
};

type Test1 = DynamicUnitAssignment<''>
type Test2 = DynamicUnitAssignment<'Foo'>
type Test3 = DynamicUnitAssignment<'FooBar'>
type Test4 = DynamicUnitAssignment<'FooBar60Baz'>
type Test5 = DynamicUnitAssignment<'asdFooBarFoo60Baz'>
type Test6 = DynamicUnitAssignment<'Foo22Bar60'>
type Test7 = DynamicUnitAssignment<'Baz6022FooBar'>
