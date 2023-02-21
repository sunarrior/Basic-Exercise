export default class User {
  constructor(userid, name, username, email, password, activeStatus) {
    this.userid = userid;
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.activeStatus = activeStatus;
  }
}
