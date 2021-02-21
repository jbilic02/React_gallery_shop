import React from 'react'
import BtnRender from './BtnRender'


function ProductItem({product, isAdmin, deleteProduct}) {
    return (
        <div className="product_card">
            {
                //checkbox za izbrisat sliku ako je prijavljeno kao admin
                isAdmin && <input type="checkbox" checked={product.checked}/>
            }

            <img src={product.images.url} alt="" />

            <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <hr></hr>
                
                <span>Cijena:  {product.price}kn</span>
                <br></br>
                <p>{product.description}</p>
                
            </div>

            <BtnRender product={product} deleteProduct={deleteProduct} />
                
        </div>
    )
}

export default ProductItem
