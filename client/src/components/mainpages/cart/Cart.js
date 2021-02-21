import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)

    //ovo se stavlja pod useEffect jer kada react rendera nasu komponentu, pamtit ce se effect koji smo koristili i update-at DOM-a
    useEffect(() =>{ 
        const getTotal = () =>{
            const total = cart.reduce((prev, item) => {// spremamo u prev(predstavlja akumulator) te nadodajemo novu vrijednost na prev
                return prev + (item.price * item.quantity)//dodavanje na prethodnika odnosno na akumulator
            },0)

            setTotal(total)//postavi res koji je definiran u arrow funkciji
        }

        getTotal()//vracanje funkcije

    },[cart])//drugi argument je niz koji sadrži dependency za usporedbu


    const addToCart = async () =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }


    const increment = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity += 1
            }
        })

        setCart([...cart])
        addToCart()
    }


    const decrement = (id) =>{ //smanjenje count-a, šaljemo id proizvoda kojeg želimo smanjiti
        cart.forEach(item => {//prolazi se loop petljon kroz sve iteme(proizvode) te trazimo odgovarajući i povecavamo count bez da ista vracamo !!
            if(item._id === id){//ako je ovo true, trazi dok ne naides na true
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1 //provjera izraza, ako je true(count je 1) onda ne smanjuj,a inače smanji
            }
        })

        setCart([...cart])// postavi promjenu na kartici
        addToCart()
    }


    const removeProduct = id =>{
        if(window.confirm("Zelite li izbrisati proizvod?")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart()
        }
    }


    if(cart.length === 0)
        return <h2 style={{textAlign: "center", fontSize: "5rem"}}>Kosarica prazna</h2>
    
    return (
        <div>
            {
                cart.map(product => (//za svaki proizvod u kartici
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt="" height="120" />
                        
                        <div className="box-detail">
                            <h2>{product.title}</h2>
                            <br /> 
                            <h3>{product.price * product.quantity} kn</h3>
                            <p>{product.description}</p>
                            <br /> 
                            {/*botuni za smanjenje, povecanje i brisanje proizvoda */}
                            <div className="amount">
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>

                            <div className="delete" 
                            onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }
            <br /> 
            <div className="total">
                <h3>Sveukupno: {total} kn</h3>
                <button onClick={() => alert('Hvala na kupovini!')}>
                    <h2>Platiti</h2>
                </button>
                
                
            </div>
            <br /> 
            <br /> 
        </div>
    )
}
export default Cart