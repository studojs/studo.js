import { CountryPrefix } from './shared';

export interface BlockingFullscreenDialogResponse {
  blockingFullscreenDialog: Record<string, any>;
  countryPrefixes: CountryPrefix[];
  clientSettingsUpdate: 'clientSettingsUpdate';
}
