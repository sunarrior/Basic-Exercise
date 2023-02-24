const warningBar = function (msg) {
  const warning = `<div class="alert alert-warning" role="alert"> ${msg} </div>`;
  return warning;
};

const taskUI = function (taskid, content, createdAt, dueDate, isComplete) {
  let checked = "";
  let completedBgColor = "";
  if (isComplete) {
    checked = "checked";
    completedBgColor = `style="background-color: rgb(134 239 172);"`;
  }
  const task = `
    <li ${completedBgColor} id="task-container-${taskid}"
      class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-2 mb-2">
      <div class="d-flex align-items-center">
          <input id="taskCheck" class="form-check-input me-2" type="checkbox" value=${taskid} aria-label="..." onchange="updateStatus(this)" ${checked}/>
          <label class="form-check-label">${content}</label>
      </div>
      <div class="d-flex">
        <div
          class="py-2 px-3 me-2 border border-success rounded-3 d-flex align-items-center bg-light">
          <p class="small mb-0">
            <i class="fas fa-hourglass-half me-2 text-success" data-mdb-toggle="tooltip" title="Create on date"></i>
            ${createdAt}
          </p>
        </div>
        <div
          class="py-2 px-3 me-2 border border-warning rounded-3 d-flex align-items-center bg-light">
          <p class="small mb-0">
            <i class="fas fa-hourglass-half me-2 text-warning" data-mdb-toggle="tooltip" title="Due on date"></i>
            ${dueDate}
          </p>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-end mb-1">
          <a href="/tasks/${taskid}" class="text-info" data-mdb-toggle="tooltip" title="Edit todo">
              <i class="fas fa-pencil-alt me-3"></i>
          </a>
          <a href="/api/v1/task/${taskid}/delete" class="text-danger" data-mdb-toggle="tooltip" title="Delete todo">
              <i class="fas fa-trash-alt"></i>
          </a>
      </div>
    </li>
  `;
  return task;
};

export default {
  warningBar,
  taskUI,
};
