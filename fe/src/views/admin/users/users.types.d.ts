type TUsers = TResponse<'/api/admin/users/', 'get'>['data']
type TUser = TUsers[number]

type TUserFilters = TRequestQuery<'/api/admin/users/', 'get'>

type TInviteUserData = TRequestBody<'/api/admin/users/invite-user/', 'post'>
type TResendInviteUserData = TRequestBody<'/api/admin/users/{userId}/resend-invite/', 'post'> & { userId: string }
