let modalQt =1;
let cart = [ ];
let modalKey = 0; 

//Auxiliares
const pegarItem = (el) => document.querySelector(el) //retorna 1 item

const pegarItens =(el) => document.querySelectorAll (el) //retorna Array com itens 



//Listagem das pizzas
pizzaJson.map(function (item , index){ 
        let pizzaItem = pegarItem('.models .pizza-item').cloneNode(true);

        //listar nome pizzas, preço , imagem, pizza selecionada
        pizzaItem.setAttribute('data-key', index)

        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
        pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
        pizzaItem.querySelector('.pizza-item--img img').src = item.img

        //evento para clicar e abrir para inserir no carrinho, e adicionar informações na hora da compra
        pizzaItem.querySelector('a').addEventListener('click', (e)=>{
            e.preventDefault();

            let key = e.target.closest ('.pizza-item').getAttribute('data-key');

            modalQt = 1;
            modalKey = key;

            pegarItem('.pizzaBig img').src = pizzaJson[key].img
            pegarItem('.pizzaInfo h1').innerHTML = pizzaJson[key].name
            pegarItem('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
            pegarItem('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`
           
            pegarItem('.pizzaInfo--size.selected').classList.remove('selected')

            pegarItens('.pizzaInfo--size').
            forEach((size , sizeIndex)=>{

                if(sizeIndex == 2){ 
                    size.classList.add('selected');
                }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex] 
            });

            pegarItem('.pizzaInfo--qt').innerHTML = modalQt

            pegarItem('.pizzaWindowArea').style.opacity = 0;
            pegarItem('.pizzaWindowArea').style.display = 'flex';
            setTimeout(() => {
                pegarItem('.pizzaWindowArea').style.opacity = 1;
            }, 200)
            
        })
        
        // preencher as informações em pizza item
        pegarItem('.pizza-area').append(pizzaItem);
         
});

//Eventos do Modal
function closeModal() { 
          pegarItem('.pizzaWindowArea').style.opacity = 0;
          setTimeout(()=>{
              pegarItem('.pizzaWindowArea').style.display = 'none';
          },500)       
}

pegarItens('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

pegarItem('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQt > 1){
    modalQt--;
        pegarItem('.pizzaInfo--qt').innerHTML = modalQt
    }
});

pegarItem('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        pegarItem('.pizzaInfo--qt').innerHTML = modalQt
});

pegarItens('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        pegarItem('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected')
    })
});

pegarItem('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(pegarItem('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){ 
        cart[key].qt += modalQt
    }
    else{
  
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    });
    }
    updateCart()
    closeModal()
});
pegarItem('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){ 
        pegarItem('aside').style.left = '0';
    }
});

pegarItem('.menu-closer').addEventListener('click', ()=>{ 
    pegarItem('aside').style.left = '100vw'
})

//inserir itens no carrinho
function updateCart(){ 
    pegarItem('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0){ 
        pegarItem('aside').classList.add('show');
        pegarItem('.cart').innerHTML = ' ';
        let subtotal = 0;
        let desconto = 0;
        let total = 0


        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id
            );

            subtotal+= pizzaItem.price * cart[i].qt;

            let cartItem = pegarItem('.models .cart--item').cloneNode(true); 

            let pizzaSizeName;
            switch(cart[i].size){ 
                case 0:
                    pizzaSizeName = 'P'
                break

                case 1: 
                pizzaSizeName = 'M'
                break

                case 2: 
                pizzaSizeName = 'G'
                break
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src=pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML =pizzaName;    
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--
                } else { 
                    cart.splice(i, 1)
                }
                updateCart();
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            })


            pegarItem('.cart').append(cartItem);
    }
        desconto = subtotal * 0.1
        total = subtotal - desconto;

        pegarItem('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`

        pegarItem('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

        pegarItem('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    } else { 
        pegarItem('aside').classList.remove('show')
        pegarItem('aside').style.left = '100vw'
    }
};



