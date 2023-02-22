export default class User {
  constructor(userid, name, username, email, passwd, active_status) {
    this.userid = userid;
    this.name = name;
    this.username = username;
    this.email = email;
    this.passwd = passwd;
    this.active_status = active_status;
  }
}
