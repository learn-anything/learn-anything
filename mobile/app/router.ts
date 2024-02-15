import { createStackRouter, RouteDefinition } from 'solid-navigation';
import { useGlobal } from './Global/global';
import { createSignal } from 'solid-js';
import { Label } from '@nativescript/core';

declare module 'solid-navigation' {
  export interface Routers {
    Default: {
      Home: RouteDefinition;
      Settings: RouteDefinition;
      SettingsPreference: RouteDefinition;
      SettingsProfile: RouteDefinition;
      SettingsMember: RouteDefinition;
      Notes: RouteDefinition<{
        noteId?: string;
      }>;
    };
  }
}

export const { Route, StackRouter, useParams, useRouter } = createStackRouter<'Default'>();
