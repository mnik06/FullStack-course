type TUsers = TResponse<'/api/admin/users/', 'get'>['data']
type TUser = TUsers[number]

type TUserFilters = TRequestQuery<'/api/admin/users/', 'get'>
