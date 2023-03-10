import typeorm from "typeorm";

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: "User",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: true,
    },
    username: {
      type: "varchar",
      unique: true,
    },
    email: {
      type: "varchar",
      unique: true,
    },
    passwd: {
      type: "varchar",
    },
    active_status: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    tasks: {
      target: "Task",
      type: "one-to-many",
      joinTable: true,
      inverseSide: "user",
      cascade: true,
    },
  },
});
