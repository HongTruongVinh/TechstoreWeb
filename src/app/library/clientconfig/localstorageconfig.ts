export class LocalStorageConfig {

  private static currentUserKey = 'currentUser';

  public static RemoveUser() {
    localStorage.removeItem(this.currentUserKey);
  }

  public static SetUser(pJSONStringify: string) {
    localStorage.setItem(this.currentUserKey, pJSONStringify);
  }

  public static GetUser() {
    const user = localStorage.getItem(this.currentUserKey);
    if (user === null || user == 'undefined') return null;
    return JSON.parse(user ?? '');
  }

  public static GetParishId() {
    const idParish = JSON.parse(localStorage.getItem(this.currentUserKey) ?? '').parishId;
    return idParish;
  }

  public static GetCurrentYearActive(): string {
    const currentYearActive = JSON.parse(localStorage.getItem(this.currentUserKey) ?? '').yearCurrent;
    return currentYearActive;
  }

}
