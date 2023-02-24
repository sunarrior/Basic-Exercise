import typeorm from "typeorm";

const EntitySchema = typeorm.EntitySchema;

export default new EntitySchema({
  name: "Task",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    content: {
      type: "varchar",
    },
    created_at: {
      type: "datetime",
    },
    due_date: {
      type: "datetime",
    },
    is_complete: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinTable: true,
      joinColumn: true,
    },
  },
});
