class LocalStorageService {
  lsKeys = {
    lastPaginationPageSize: 'lastPaginationPageSize'
  }

  getItem (key: keyof typeof this.lsKeys) {
    return JSON.parse(localStorage.getItem(this.lsKeys[key]) || '10')
  }

  setItem (key: keyof typeof this.lsKeys, value: any) {
    localStorage.setItem(this.lsKeys[key], JSON.stringify(value))
  }
}

export const localStorageService = new LocalStorageService()
