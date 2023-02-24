export default class Task {
  constructor(id, content, created_at, due_date, is_complete, userId) {
    this.id = id;
    this.content = content;
    this.createdAt = created_at;
    this.dueDate = due_date;
    this.isComplete = is_complete;
    this.userId = userId;
  }
}
