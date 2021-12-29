import { customAlphabet } from 'nanoid';
import { randomInstallationId } from '../client';
import { deviceName } from '../config';
import { RestManager } from '../rest/restManager';
import { GenericResponse } from '../rest/schema/shared';

export type SendVerificationSmsResponse =
  | 'SUCCESS'
  | 'TOO_MANY_SMS_SENT'
  | 'USER_NOT_FOUND'
  | 'INVALID_NUMBER'
  | 'ALREADY_LINKED_TO_ANOTHER_ACCOUNT'
  | 'ALREADY_LINKED_TO_THIS_ACCOUNT';

export interface VerifySMSAndSignInResponse extends GenericResponse {
  userId: string;
  studoSessionToken: string; // 32 byte hex
}

export class SmsVerification {
  private readonly body: Record<string, any>;

  /**
   * @param countryPrefix `+` followed by the country code
   * @param phoneNumber Entire phone number without the country code component
   */
  constructor(readonly countryPrefix: string, readonly phoneNumber: string) {
    this.body = {
      countryPrefix,
      phoneNumber,
      createNewUser: false,
      secret: generateSecret(),
      installationId: randomInstallationId(),
      deviceName,
    };
  }

  /**
   * Sends a token via SMS to the phone.
   * Throws an error when failing.
   */
  async send(): Promise<void> {
    const body = JSON.stringify({ ...this.body, source: 'android-button' });
    const response = await RestManager.request('POST', 'auth/sendVerificationSms', { body });
    const text = (await response.text()) as SendVerificationSmsResponse;
    if (text !== 'SUCCESS') throw new Error(text);
  }

  /**
   * Signs in using the received token.
   * Throws an error when failing.
   * @param smsToken 4 digits
   */
  async signIn(smsToken: string): Promise<VerifySMSAndSignInResponse> {
    const body = JSON.stringify({
      ...this.body,
      smsVerificationToken: smsToken,
      clientReferrer: 'utm_source=google-play&utm_medium=organic',
    });
    const response = await RestManager.request('POST', 'auth/verifySmsAndSignIn', { body });
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (error) {
      throw new Error(responseText);
    }
  }
}

/**
 * @see com.moshbit.studo.auth.sms.SmsPhoneNumberFragment$onViewCreated$5
 * @returns 32 byte hex string
 */
const generateSecret = customAlphabet('0123456789abcdef', 64);
