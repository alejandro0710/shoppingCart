const items = document.querySelector('.items');
const footer = document.querySelector('.footer');
const cardsContainer = document.querySelector('.cards');
const templateCard = document.querySelector('.template-card').content;
const templateFooter = document.querySelector('.template-footer').content;
const templateCarShopping = document.querySelector('.template-carrito').content;
const fragment = new DocumentFragment();
let shoppingCart = {};

const fetchData = async () => {
  try {
    const res = await fetch('data-base.json');
    const data = await res.json();
    // console.log(data);
    itemsCards(data);
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  if (localStorage.getItem('shoppingCart')) {
    shoppingCart = JSON.parse(localStorage.getItem('shoppingCart'));
    paintCar();
  }
});

const buttonPurchase = (event) => {
  if (event.target.classList.contains('btn-dark')) {
    event.target.parentElement;
    setCar(event.target.parentElement);
  }
  event.stopPropagation();
};

const setCar = (object) => {
  // console.log(object);

  const product = {
    id: object.querySelector('.btn-dark').dataset.class,
    title: object.querySelector('h5').textContent,
    price: object.querySelector('.price').textContent,
    amount: 1,
  };
  if (shoppingCart.hasOwnProperty(product.id)) {
    product.amount = shoppingCart[product.id].amount + 1;
  }
  shoppingCart[product.id] = { ...product };
  paintCar();
};

const paintCar = () => {
  // console.log(shoppingCart);
  items.innerHTML = '';
  Object.values(shoppingCart).forEach((producto) => {
    templateCarShopping.querySelector('th').textContent = producto.id;
    templateCarShopping.querySelectorAll('td')[0].textContent = producto.title;
    templateCarShopping.querySelectorAll('td')[1].textContent = producto.amount;
    templateCarShopping.querySelector('.btn-info').dataset.id = producto.id;
    templateCarShopping.querySelector('.btn-danger').dataset.id = producto.id;
    templateCarShopping.querySelector('span').textContent =
      producto.amount * producto.price;

    const clone = templateCarShopping.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  paintFooter();

  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
};

const paintFooter = () => {
  footer.innerHTML = '';
  if (Object.keys(shoppingCart).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
  } else {
    const nAmount = Object.values(shoppingCart).reduce(
      (acc, { amount }) => acc + amount,
      0
    );
    const nPrice = Object.values(shoppingCart).reduce(
      (acc, { amount, price }) => acc + amount * price,
      0
    );

    templateFooter.querySelectorAll('td')[0].textContent = nAmount;
    templateFooter.querySelector('span').textContent = nPrice;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    const btnEmpty = document.querySelector('.vaciar-carrito');

    btnEmpty.addEventListener('click', () => {
      shoppingCart = {};
      paintCar();
    });
  }
};

items.addEventListener('click', (evento) => {
  btnAction(evento);
});

const btnAction = (e) => {
  // console.log(e.target);
  if (e.target.classList.contains('btn-info')) {
    // console.log(shoppingCart[e.target.dataset.id]);
    const producto = shoppingCart[e.target.dataset.id];
    producto.amount++;
    shoppingCart[e.target.dataset.id] = { ...producto };
    paintCar();
  }
  if (e.target.classList.contains('btn-danger')) {
    const producto = shoppingCart[e.target.dataset.id];
    producto.amount--;
    if (producto.amount === 0) {
      delete shoppingCart[e.target.dataset.id];
    }
    paintCar();
  }
  e.stopPropagation();
};

cardsContainer.addEventListener('click', (evento) => {
  buttonPurchase(evento);
});

const itemsCards = (data) => {
  data.forEach((element) => {
    templateCard.querySelector('h5').textContent = element.title;
    templateCard.querySelector('img').setAttribute('src', element.thumbnailUrl);
    templateCard.querySelector('.tipe').textContent = element.tipe;
    templateCard.querySelector('.price').textContent = element.price;
    templateCard.querySelector('button').dataset.class = element.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cardsContainer.appendChild(fragment);
};
