const sectionCard = document.getElementById('group-card');
const notification = document.getElementById('notifi');
const searchSection = document.getElementById('sec-search');
const containerSearch = document.getElementById('group-card-search');
const search = document.getElementById('search');

let array = [];
document.getElementById('form-items').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name-acti').value;
    const description = document.getElementById('description').value;
    addObjects(name, description);
    document.startViewTransition(() => {
        ActionNotification(1);
        CreateCard(name, description, sectionCard);
    })
})

function addObjects(name, description) {
    const obj = {
        name: name,
        description: description
    }

    array.unshift(obj);
    localStorage.setItem('Cards', JSON.stringify(array));
}

function CreateCard(name, description, idSection) {
    const divCard = document.createElement("div");
    divCard.className = "card fade";
    divCard.innerHTML = `
        <header class="card-header">
            <h1 class="card-title align-center">${name}</h1>
        </header>
        <div class="card-body">
            <div class="card-text">${description}</div>
        </div>
        <div class="card-actions">
            <button class="btn btn-edit">Editar</button>
            <button class="btn btn-danger">Eliminar</button>
        </div>
    `;
    idSection.prepend(divCard);

    // Evento para editar
    const btnEdit = divCard.querySelector('.btn-edit');
    btnEdit.addEventListener('click', () => {
        EditCard(divCard, name, description);
    });

    // Evento para eliminar
    const btnDelete = divCard.querySelector('.btn-danger');
    btnDelete.addEventListener('click', () => {
        DeleteCard(divCard, name);
    });

    divCard.addEventListener('animationend', () => {
        divCard.classList.remove('fade');
    }, { once: true });
}


document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('Cards'));
    if (data != null) {
        array = data
        const inverse = array.slice();
        inverse.reverse().forEach((e) => {
            document.startViewTransition(() => {
                CreateCard(e.name, e.description, sectionCard)
            })
        });
    }
})

function ActionNotification(key) {
    switch (key) {
        case 1:
            notification.firstElementChild.innerText = "Se agrego con exito";
            notification.classList.add('notification-add', 'scale-in');
            setTimeout(() => {
                notification.classList.remove('scale-in');
                notification.classList.add('scale-out');
                setTimeout(() => {
                    notification.classList.remove('notification-add', 'scale-out');
                }, 1000);
            }, 2000);
            break;
        case 2:

            break;
        default:
            break;
    }
}
/* btn-close */
document.getElementById('btn-search').addEventListener('click', () => {
    document.startViewTransition(() => {
        searchSection.style.display = "flex";
    })
});

document.getElementById('btn-close').addEventListener('click', () => {
    document.startViewTransition(() => {
        searchSection.style.display = "none";
    })
});

search.addEventListener('input', () => {
    const text = search.value;
    if (text != '') {
        const resultado = array.filter((data) => data.name.includes(text));
        containerSearch.innerHTML = "";
        resultado.forEach((e) => {
            CreateCard(e.name, e.description, containerSearch);
        });
    }

})


//-----

function EditCard(card, oldName, oldDescription) {
    const nameInput = prompt("Editar nombre:", oldName);
    const descriptionInput = prompt("Editar descripción:", oldDescription);

    if (nameInput !== null && descriptionInput !== null) {
        // Actualiza el DOM
        card.querySelector('.card-title').innerText = nameInput;
        card.querySelector('.card-text').innerText = descriptionInput;

        // Actualiza el array y el localStorage
        const index = array.findIndex((item) => item.name === oldName);
        if (index > -1) {
            array[index] = { name: nameInput, description: descriptionInput };
            localStorage.setItem('Cards', JSON.stringify(array));
        }
    }
}
//-----

function DeleteCard(card, name) {
    // Elimina del DOM
    card.remove();

    // Elimina del array y localStorage
    array = array.filter((item) => item.name !== name);
    localStorage.setItem('Cards', JSON.stringify(array));
}
//----
document.getElementById('btn-delete-all').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas eliminar todas las actividades?")) {
        // Limpia el DOM
        sectionCard.innerHTML = "";
        containerSearch.innerHTML = "";

        // Limpia el array y el almacenamiento local
        array = [];
        localStorage.removeItem('Cards');

        ActionNotification(2); // Muestra una notificación si es necesario
    }
});

