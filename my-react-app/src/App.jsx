import { use } from 'react';
import { useState, useEffect } from 'react'

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [categoryList, setCategoryList] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const result = await response.json();
      
      setProducts(result);
    }catch{
      setProducts([])
    }
  }

    const fetchCategory = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products/categories");
      const result = await response.json();
      setCategoryList(result);
    }catch{
      setCategoryList([]);
    }
  }


  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, [])

  console.log("PRODUCTS: " + JSON.stringify(products))
  console.log("Category: " + JSON.stringify(categoryList))

  function addToCart(product) {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

    const visible = products
    .filter((p) => category === "all" || p.category === category)

    console.log("VISIBLE: " + JSON.stringify(visible))


    function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  console.log({cart})

  const total = cart.reduce((sum, item) => sum+item.price*item.qty, 0)
  

  return (
    <div className = "min-h-screen bg-gray-100 flex justify-center gap-4">
      <div className='min-w-20 border-b '>
        <h1>Category</h1>
        <div className='p-2 flex flex-col'>
          <button className="p-1 border rounded" onClick={() => setCategory("all")}>All</button>
        {categoryList.map((c) => (
          <button className="p-1 border rounded" key={c} onClick={() => setCategory(c)}>{c}</button> 
        ))}
        </div>
        
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-3 p-4 gap-4 justify-between'>
        {visible.map((item) => (
          <div key={item.id} className='min-w-12 min-h-12 border items-center justify-center'>
            <img src={item.image} className='w-16 h-16'></img>
            <h4 className='text-bold'>{item.title}</h4>
            <p>{item.price}</p> 
            <button className='bg-blue p-4'
            onClick = {() => addToCart(item)}> + Add to cart</button>
          </div>
        ))}
      </div>
      <div>
        <h1>Cart</h1>
    {cart.map((item) => <div className='min-w-12 min-h-12 border'>
      <h1>{item.title}</h1>
      <p>{item.qty}</p>
      <p>{item.price}</p>
      <button onClick = {()=>changeQty(item.id, -1)}>-</button>
            <button onClick={()=>changeQty(item.id, +1)}>+</button>
      </div>)}
      </div>

      TOTAL: {total}
    </div>
  )
}

export default App
