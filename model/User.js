export default class User {
  constructor(id, name, username, email, passwd, activeStatus) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.passwd = passwd;
    this.activeStatus = activeStatus;
  }
}
