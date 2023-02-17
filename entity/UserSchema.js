import typeorm from "typeorm";
import User from "../model/User.js";

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: "User",
  target: User,
  columns: {
    userid: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    username: {
      type: "varchar",
      unique: true,
    },
    email: {
      type: "varchar",
      nullable: true,
    },
    password: {
      type: "varchar",
    },
  },
});
