export type UnisClientFetchResponse = UniClient[];

interface UniClient {
  uniId: string;
  hidden: boolean;
  name: string;
  shortName: string;
  beta: boolean;
  uniSystemName: string;
  uniSystemLoginHint: string;
  uniSystemUsernameHint: string;
  uniSystemLoginFormImageUrl: string;
  uniSystemLoginFormHint: string;
  uniSystemLoginLoadingHint: string;
  parserName: string;
  country: string;
  federalState: string;
  federalStateList: string;
  city: string;
  longitude: number;
  latitude: number;
  uniSystemChangePasswordUrl: string;
  backgroundSyncHours: number;
  authViaMail: boolean;
  authViaMailAlwaysReturnLoginSuccess: boolean;
  sideDrawerBottomImageUrl: string;
  whiteLabelToolbarImageUrl: string;
  uniSystemAllowEmailAsUsername: boolean;
  examRegistrationAvailable: boolean;
  searchKeywords: string;
  baseUrl: string;
  webmailUrl: string;
  uniServices: any[];
  courses: boolean;
  calendar: boolean;
  news: boolean;
  exams: boolean;
  studies: boolean;
  search: boolean;
  rooms: boolean;
  lunch: boolean;
  webmail: boolean;
  nativeMail: boolean;
  chat: boolean;
  nativeMailImapHost: string;
  nativeMailImapPort: number;
  nativeMailImapConnectionType: number;
  nativeMailImapAuthType: number;
  nativeMailImapcheckCertificateEnabled: boolean;
  nativeMailSmtpHost: string;
  nativeMailSmtpPort: number;
  nativeMailSmtpConnectionType: number;
  nativeMailSmtpAuthType: number;
  nativeMailSmtpcheckCertificateEnabled: boolean;
  nativeMailEnableLoginUI: boolean;
  nativeMailPrefillUsername: boolean;
  nativeMailLoginHint: string;
  nativeMailSystemName: string;
  nativeMailUsernamePrefix: string;
  nativeMailUsernameSuffix: string;
  nativeMailSync: boolean;
  nativeMailIgnoredMailFolders: string;
  nativeMailEnableBackgroundDownload: boolean;
  mailAccountDescriptors: MailAccountDescriptor[];
  oauthClientId: string;
  oauthAuthorizationScope: string;
  oauthAuthorizationEndpointUrl: string;
  oauthTokenEndpointUrl: string;
  calendarEventChangeNotifications: boolean;
}

interface MailAccountDescriptor {
  mailAccountId: string;
  imapHost: string;
  imapPort: number;
  imapConnectionType: number;
  imapAuthType: number;
  imapCheckCertificateEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpConnectionType: number;
  smtpAuthType: number;
  smtpCheckCertificateEnabled: boolean;
  enableLoginUI: boolean;
  prefillUsername: boolean;
  loginHint: string;
  systemName: string;
  usernamePrefix: string;
  usernameSuffix: string;
  imapRemoveUsernamePrefix: string;
  imapRemoveUsernameSuffix: string;
  smtpRemoveUsernamePrefix: string;
  smtpRemoveUsernameSuffix: string;
  sync: boolean;
  ignoredMailFolders: string;
  enableBackgroundDownload: boolean;
  oneTimeAutoDetect: boolean;
  emailAddressAutoDetectionEnabled: boolean;
  emailAddressAutoDetectionBlacklistHashes: string;
  addFallbackFolderNames: boolean;
}
