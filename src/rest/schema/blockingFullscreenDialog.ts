interface CountryPrefix {
  emoticon: string;
  prefix: string;
  name: string;
}

export interface BlockingFullscreenDialogResponse {
  blockingFullscreenDialog: Record<string, any>;
  countryPrefixes: CountryPrefix[];
  clientSettingsUpdate: 'clientSettingsUpdate';
}
