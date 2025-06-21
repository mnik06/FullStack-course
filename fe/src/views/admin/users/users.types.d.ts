type TUsers = TResponse<'/api/admin/users/', 'get'>['users']
type TUser = TUsers[number]
