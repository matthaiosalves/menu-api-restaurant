let cart = [];
let modalKey = 0;
let modalQt = 1;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
let zapzap = 'https://api.whatsapp.com/send?phone=5561992739733&text=Items:%0A- ';

function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// Listagem das potatos
potatoJson.map((item, index)=>{
    let potatoItem = c('.models .potato-item').cloneNode(true);
    //preencher as informações em potato-item


    potatoItem.setAttribute('data-key', index);
    potatoItem.querySelector('.potato-item--img img').src = item.img;
    potatoItem.querySelector('.potato-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    potatoItem.querySelector('.potato-item--name').innerHTML = item.name;
    potatoItem.querySelector('.potato-item--desc').innerHTML = item.description;

    //Menu com a seleção de potato, tamanhos, quantidades e preço
    potatoItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        let key = e.target.closest('.potato-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        

        c('.potatoBig img').src = potatoJson[key].img;
        c('.potatoInfo h1').innerHTML = potatoJson[key].name;
        c('.potatoInfo--desc').innerHTML = potatoJson[key].description;
        c('.potatoInfo--actualPrice').innerHTML = `R$ ${potatoJson[key].price.toFixed(2)}`;
        //c('.potatoInfo--size.selected').classList.remove('selected');

        //Mudança de tamanho
        //cs('.potatoInfo--size').forEach( (size, sizeIndex)=>{
        //    if (sizeIndex == 2){
        //        size.classList.add('selected');
        //    }
        //    size.querySelector('span').innerHTML = potatoJson[key].sizes[sizeIndex];
        //});
        c('.potatoInfo--qt').innerHTML = modalQt;
        c('.potatoWindowArea').style.opacity = 0;
        c('.potatoWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.potatoWindowArea').style.opacity = 1;
        }, 200);

    });

    c('.potato-area').append( potatoItem );

    

});

// Eventos do MODAL
function closeModal(){
    c('.potatoWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.potatoWindowArea').style.display = 'none';
    }, 500);
}

cs('.potatoInfo--cancelButton, .potatoInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

// Aumentar/Diminuir a quantidade de potatos
c('.potatoInfo--qtmais').addEventListener( 'click', ()=>{
    modalQt++;
    c('.potatoInfo--qt').innerHTML = modalQt;
});

c('.potatoInfo--qtmenos').addEventListener( 'click', ()=>{
    if (modalQt > 1){
         modalQt--;
        c('.potatoInfo--qt').innerHTML = modalQt;
    }
});

//Eventos de mudança de tamanho
//cs('.potatoInfo--size').forEach((size, index)=>{
//    size.addEventListener('click', (e)=>{
//        c('.potatoInfo--size.selected').classList.remove('selected');
//        size.classList.add('selected');
//    });
//});

c('.potatoInfo--addButton').addEventListener('click', ()=>{
    //let size =  c('.potatoInfo--size.selected').getAttribute('data-key');
    //let size = parseInt(c('.potatoInfo--size.selected').getAttribute('data-key'));  

    let identifier = potatoJson[modalKey].id;

    let key = cart.findIndex( (item)=> item.identifier == identifier);

    if (key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:potatoJson[modalKey].id,
            qt:modalQt
        });
    }

    updateCard();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCard(){
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        let zapItems = [];
        zapzap = 'https://api.whatsapp.com/send?phone=5561992739733&text=Items: ';

        for (let i in cart){
            let potatoItem = potatoJson.find((item)=>item.id == cart[i].id);
            subtotal += potatoItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);

            let potatoNome = `${potatoItem.name}`;

            cartItem.querySelector('img').src = potatoItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = potatoNome;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if (cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                    
                }
                updateCard();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCard();
            });

            zapItems.push(`%0A- ${potatoItem.name} x${cart[i].qt} ${formatNumber(potatoItem.price)}`);


            c('.cart').append(cartItem);
        }

        // desconto = subtotal * 0.1;
        desconto = 0;
        total = subtotal;
        
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

        zapzap += zapItems.join(' ');
        zapzap += `%0ATotal: *${formatNumber(total.toFixed(2))}*`

        var containerFinalizar = document.getElementById('finalizar');

        containerFinalizar.innerHTML = `
            <div class="cart--finalizar" onclick="javascript:abrirJanela('${zapzap}', 400, 700);">Finalizar Compra</div>   
        `;

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }

        
}