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

- /api/v1/ad/click
- /api/v1/ad/show
- /api/v1/analytics/adjustInfo
- /api/v1/analytics/appStartPerformance
- /api/v1/analytics/appstart
- /api/v1/analytics/mailsend/status
- /api/v1/analytics/mailsend/status
- /api/v1/analytics/mailsend/status
- /api/v1/analytics/mailsend/status
- /api/v1/analytics/mailsync/connect
- /api/v1/analytics/mailsync/error
- /api/v1/analytics/mailsync/error
- /api/v1/analytics/mailsync/status
- /api/v1/analytics/phoneNumberChangeDetection/action
- /api/v1/analytics/phoneNumberChangeDetection/prompt
- /api/v1/analytics/referral/share
- /api/v1/analytics/socketConnection
- /api/v1/auth/link/uni
- /api/v1/auth/logout
- /api/v1/auth/oauthAuthResponse
- /api/v1/auth/sendVerificationSms
- /api/v1/auth/sendVerificationSms
- /api/v1/auth/uniRequest
- /api/v1/auth/unlink/uni
- /api/v1/auth/verifySms
- /api/v1/auth/verifySmsAndSignIn
- /api/v1/bookmark/delete
- /api/v1/bookmark/set
- /api/v1/bookmark/set
- /api/v1/event/delete
- /api/v1/event/set
- /api/v1/event/set
- /api/v1/event/set
- /api/v1/event/set
- /api/v1/news/cancel
- /api/v1/news/fetch/{newsId}
- /api/v1/news/followNewsOrganization
- /api/v1/pro/enterInviteLink
- /api/v1/pro/set
- /api/v1/referral/rewardScreenShown
- /api/v1/settings/blockingFullscreenDialogOk
- /api/v1/settings/blockingFullscreenDialogShow
- /api/v1/settings/calendarColors
- /api/v1/settings/calendarColors
- /api/v1/settings/calendarColors
- /api/v1/settings/calendarColorsReset
- /api/v1/settings/calendarFeedImport/delete
- /api/v1/settings/calendarFeedImport/import
- /api/v1/settings/calendarFeedImport/rename
- /api/v1/settings/calendarFulldayDetection
- /api/v1/settings/calendarGroups
- /api/v1/settings/calendarHidden
- /api/v1/settings/calendarHidden
- /api/v1/settings/calendarInitials
- /api/v1/settings/calendarMode
- /api/v1/settings/calendarStripedEvents
- /api/v1/settings/courseSectionOrder
- /api/v1/settings/getLatest
- /api/v1/settings/lastIntercomInteraction
- /api/v1/settings/lunchFavourites
- /api/v1/settings/mailConnectionCheck
- /api/v1/settings/setColorTheme;
- /api/v1/settings/webViewCredentialAutoFilling
- /api/v1/todo/clearTrashedLists
- /api/v1/todo/deleteTasks
- /api/v1/todo/editList
- /api/v1/todo/editTask
- /api/v1/tracker/getArticle/{newsId}
- /api/v1/tracker/impressions
- /api/v1/user/registerOneSignalToken
- /api/v1/user/sendTestPushNotification
- /api/v1/voucher/redeem
- /api/v1/webViewCredential/clearAll
- /api/v1/webViewCredential/save
- /api/v1/webViewCredential/update
