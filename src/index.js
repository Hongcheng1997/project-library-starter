import './style.css';

function component() {
    var element = document.createElement('h1');
    element.innerHTML = 'Hello webpack'
    element.classList.add('app');

    return element;
}

document.body.appendChild(component());