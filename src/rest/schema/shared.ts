export interface GenericResponse {
  isPro: boolean;
  lastIntercomInteraction: string; // ISO 8601 date
  lunchFavourites: string[];
  calendarHidden: string[];
  calendarColors: CalendarColors;
  calendarGroups: Record<string, boolean>;
  referredUsers: number;
  referralProVouchers: ClientProVoucher[];
  showReferralRewardScreen: boolean;
  workloadCourseIds: string[];
  workloadEntries: Record<string, any>[];
  isReviewer: boolean;
  phoneNumber: string;
  phoneNumberForceMigrationOnAppStart: boolean;
  phoneNumberSoftMigrationOnAppStart: boolean;
  phoneNumberForceMigration: boolean;
  courseSectionOrderAscending: boolean;
  calendarFulldayDetection: boolean;
  webViewCredentialAutoFilling: boolean;
  proScreen: ProScreen;
  blockingFullscreenDialog: any;
  calendarHolidaysColor: string;
  calendarStripedEvents: boolean;
  voucherProMonths: string;
  oauthUniIds: string[];
  disabledOAuthUniIds: string[];
  countryPrefixes: CountryPrefix[];
  chatDbVersion: number;
  clientSettingsUpdate: string;
}

interface ClientProVoucher {
  token: string;
  createdDate: string; // ISO 8601 date
  used: boolean;
}

interface CalendarColors {
  exams: string; // format: hex/argb
}

interface CountryPrefix {
  emoticon: string;
  prefix: string;
  name: string;
}

interface ProScreen {
  headerItem: HeaderItem;
  aboDetailsItem: AboDetailsItem;
  featuresItem: FeaturesItem;
  buttonsItem: ButtonsItem;
  actionDescriptionItem: ActionDescriptionItem;
  termsOfServiceItem: TermsOfServiceItem;
  subscriptionActive: boolean;
}

interface ProScreenItem {
  position: number;
}

interface AboDetailsItem extends ProScreenItem {
  description: string;
}

interface ActionDescriptionItem extends ProScreenItem {
  description: string;
  tip: string;
}

interface ButtonsItem extends ProScreenItem {
  buttons: Button[];
}

interface Button extends ProScreenItem {
  title: string;
  style: string;
  action: string;
}

interface FeaturesItem extends ProScreenItem {
  title: string;
  features: string[];
}

interface HeaderItem extends ProScreenItem {
  title: string;
}

interface TermsOfServiceItem extends ProScreenItem {
  termsOfService: string;
  linkText: string;
  linkUrl: string;
}
