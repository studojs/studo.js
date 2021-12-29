# API

Format: `https://api.studo.co/api/v1/{endpoint}`

## Required Headers

| Name           | Value/Notes                           |
| -------------- | ------------------------------------- |
| application-id | `com.moshbit.studo`                   |
| user-agent     | _needs to contain `android` or `ios`_ |
| session-token  | _only for authenticated requests_     |

## Endpoints

### GET `settings/getLatest` (session-token)

### GET `connect/getUserData` (session-token)

### GET `auth/sessions/list` (session-token)

### POST `unis/client/fetch`

### POST `unis/client/fetchPartial`

### POST `auth/sendVerificationSms`

### POST `auth/verifySmsAndSignIn`

### POST `auth/sessions/signOut` (session-token)

```ts
{
  sessionClientId: string;
}
```

### POST `settings/blockingFullscreenDialogOk`

### POST `settings/blockingFullscreenDialogShow`

### POST `user/registerOneSignalToken`

# all

- ad/click
- ad/show
- analytics/adjustInfo
- analytics/appStartPerformance
- analytics/appstart
- analytics/mailsend/status
- analytics/mailsync/connect
- analytics/mailsync/error
- analytics/mailsync/status
- analytics/phoneNumberChangeDetection/action
- analytics/phoneNumberChangeDetection/prompt
- analytics/referral/share
- analytics/socketConnection
- auth/link/uni
- auth/logout
- auth/oauthAuthResponse
- auth/sendVerificationSms
- auth/uniRequest
- auth/unlink/uni
- auth/verifySms
- auth/verifySmsAndSignIn
- bookmark/delete
- bookmark/set
- event/delete
- event/set
- news/cancel
- news/fetch/{newsId}
- news/followNewsOrganization
- pro/enterInviteLink
- pro/set
- referral/rewardScreenShown
- settings/blockingFullscreenDialogOk
- settings/blockingFullscreenDialogShow
- settings/calendarColors
- settings/calendarColorsReset
- settings/calendarFeedImport/delete
- settings/calendarFeedImport/import
- settings/calendarFeedImport/rename
- settings/calendarFulldayDetection
- settings/calendarGroups
- settings/calendarHidden
- settings/calendarInitials
- settings/calendarMode
- settings/calendarStripedEvents
- settings/courseSectionOrder
- settings/getLatest
- settings/lastIntercomInteraction
- settings/lunchFavourites
- settings/mailConnectionCheck
- settings/setColorTheme;
- settings/webViewCredentialAutoFilling
- todo/clearTrashedLists
- todo/deleteTasks
- todo/editList
- todo/editTask
- tracker/getArticle/{newsId}
- tracker/impressions
- user/registerOneSignalToken
- user/sendTestPushNotification
- voucher/redeem
- webViewCredential/clearAll
- webViewCredential/save
- webViewCredential/update
