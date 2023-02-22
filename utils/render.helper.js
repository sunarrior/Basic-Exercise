const warningBar = function (msg) {
  const warning = `<div class="alert alert-warning" role="alert"> ${msg} </div>`;
  return warning;
};

export default {
  warningBar,
};
