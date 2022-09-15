const tasks = [];
const strSpace = ' $A$ ';
let defaultInput = '';
let defaultDisplay = '';
let defaultCss = '';

function init(input, display, css) {
  // set defaults
  defaultInput = input;
  defaultDisplay = display;
  defaultCss = css;
  
  // display saved tasks if there are any
  if (localStorage.getItem('tasks') !== '') {
    localStorage.getItem('tasks').split(strSpace).forEach(item => {
      tasks.push(item);
      displayTask(item, css, display);
    });
  } else {
    clearTasks();
    return;
  }
}
// todo - ban use of strSpace in a submission
// todo - add an ability to make multiple lists
// todo - add more flexibility to the text editor (bold, italics, underline)
// todo - see if it's possible to skip using regex when there is no link
// todo - fix bug with toggleMenu, it takes two clicks to use
function submitTask(submission = defaultInput, css = defaultCss, display = defaultDisplay) {
  // get input
  let input = document.querySelector(`#${submission}`);
  if (input.value === '') { return; }
  
  // save input
  tasks.push(input.value);
  localStorage.setItem('tasks', tasks.join(strSpace));
  
  // display to output and clear input
  displayTask(input.value, css, display);
  input.value = '';
  autoResize(defaultInput);
}
function displayTask(submission, css, display) {
  // get output
  let output = document.querySelector(`#${display}`);
  
  // create new elements
  let div = document.createElement('div');
  let p = document.createElement('p');
  let removeBtn = document.createElement('button');
  
  // parse submission for links
  // currently group 2 can't use special characters
  let newSubmission = submission;
  let links = submission.match(/!\(([/.\-\w\d]*),?\s?([\w\d\s]*)\)/gi);
  if (links !== null) {
    links.forEach(item => {
      let temp = item.match(/([/.\-\w\d]+),?\s?([\w\d\s]*)/i);
      if (temp[2] === '') {temp[2] = temp[1];}
      newSubmission = newSubmission.replace(
        item, `<a href="https://${temp[1]}" target="_blank">${temp[2]}</a>`
      );
    });
  }
  
  // set up new elements
  div.id = tasks.length;
  div.classList.add(css);
  p.innerHTML = newSubmission;
  removeBtn.innerHTML = 'Complete';
  removeBtn.onclick = function() {
    tasks.splice(tasks.indexOf(submission), 1);
    localStorage.setItem('tasks', tasks.join(strSpace));
    document.getElementById(div.id).remove();
  };
  
  // append elements
  div.appendChild(p);
  div.appendChild(removeBtn);
  // output.appendChild(div);
  output.prepend(div);
  
}
function clearTasks(display = defaultDisplay) {
  // clear localStorage and tasks array
  localStorage.clear();
  tasks.length = 0;
  
  // clear display
  document.getElementById(display).innerHTML = '';
}
function toggleMenu(menuId) {
  let elem = document.querySelector(`#${menuId}`);
  
  if (elem.style.display === 'none') {
    elem.style.display = 'flex';
  } else {
    elem.style.display = 'none';
  }
}
function autoResize(id) {
  let elem = document.querySelector(`#${id}`);
  elem.style.height = '';
  elem.style.height = elem.scrollHeight + 'px';
}
document.addEventListener('keydown', e => {
  if (e.code === 'Enter') {
    document.getElementById(defaultInput).blur();
    submitTask();
  } else if (e.code === 'ControlRight') {
    document.getElementById(defaultInput).focus();
  }
});
