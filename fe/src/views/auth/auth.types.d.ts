type TSignupData = TRequestBody<'/api/auth/signup/', 'post'>
type TUserProfile = TResponse<'/api/user-profile/', 'get'>
type TUserRole = TUserProfile['role']
type TAcceptInviteData = TRequestBody<'/api/auth/accept-invite/', 'post'>
