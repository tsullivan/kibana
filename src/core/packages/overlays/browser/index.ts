/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

export type { OverlayBannersStart } from './src/banners';
export type {
  FlyoutPropsEnhanced,
  ManagedFlyoutEntry,
  OverlayFlyoutOpenOptions,
  OverlayFlyoutStart,
  ManagedFlyoutApi,
  UseManagedFlyoutApi,
} from './src/flyout';
export type {
  OverlayModalConfirmOptions,
  OverlayModalOpenOptions,
  OverlayModalStart,
} from './src/modal';
export type { OverlayStart } from './src/overlays';

import type { BehaviorSubject, Observable } from 'rxjs';
/**
 * Types for managing state in a flyout presentation layer.
 * These are copied from the `@kbn/flyout-presentation-state` package in order to avoid circular dependencies.
 */

/**
 * @internal
 */
export type WithAllKeys<T extends object> = { [Key in keyof Required<T>]: T[Key] };

/**
 * @internal
 */
export type ComparatorFunction<StateType, KeyType extends keyof StateType> = (
  last: StateType[KeyType] | undefined,
  current: StateType[KeyType] | undefined,
  lastState?: Partial<StateType>,
  currentState?: Partial<StateType>
) => boolean;

/**
 * @internal
 */
export type StateComparators<StateType> = {
  [KeyType in keyof Required<StateType>]:
    | 'referenceEquality'
    | 'deepEquality'
    | 'skip'
    | ComparatorFunction<StateType, KeyType>;
};

/**
 * @internal
 */
export type PublishingSubject<T extends unknown = unknown> = Omit<BehaviorSubject<T>, 'next'>;

/**
 * @internal
 */
export type SubjectsOf<T extends object> = {
  [KeyType in keyof Required<T> as `${string & KeyType}$`]: PublishingSubject<T[KeyType]>;
};

/**
 * @internal
 */
export type SettersOf<T extends object> = {
  [KeyType in keyof Required<T> as `set${Capitalize<string & KeyType>}`]: (
    value: T[KeyType]
  ) => void;
};

/**
 * @internal
 */
export interface StateManager<StateType extends object> {
  getLatestState: () => WithAllKeys<StateType>;
  reinitializeState: (
    newState?: Partial<StateType>,
    comparators?: StateComparators<StateType>
  ) => void;
  api: SettersOf<StateType> & SubjectsOf<StateType>;
  anyStateChange$: Observable<void>;
}
