import React, { useState } from 'react';
import navb from '../assets/navbar.png'
import axios from 'axios';

type Product = {
  name: string;
  qty: number;
  rate: number;
};

const AddProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([{ name: '', qty: 0, rate: 0 }]);
  const [user] = useState({ name: 'sarvesh', email: 'skothule13@gmail.com' });
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleChange = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setProducts(updatedProducts);
  };

  // Add a new product (limit to 5 products)
  const handleAddProduct = () => {
    if (products.length < 5) {
      setProducts([...products, { name: '', qty: 0, rate: 0 }]);
      setError(null);
    } else {
      setError('You can only add up to 5 products.');
    }
  };

  // Generate PDF logic (placeholder for now)
  const generatePDFInvoice = async () => {
    const totalPrice = products.reduce((acc, product) => acc + product.qty * product.rate, 0);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/generate-pdf',
        {
          user,
          products: products.map((p) => ({
            name: p.name,
            quantity: p.qty,
            price: p.rate,
          })),
          totalPrice,
        },
        {
          responseType: 'blob', // Ensure the response is a Blob
        }
      );

      // Create a URL for the PDF and force download
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = 'invoice.pdf';
      link.click();
      URL.revokeObjectURL(link.href); // Clean up the URL object after download
    } catch (error) {
      console.error('Error generating invoice:', error);
      setError('Failed to generate invoice. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#04081f] via-[#020212] to-[#000000]">
      <nav className="bg-[#1F1F1F] sticky top-0 z-50 p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="text-white font-bold text-xl"><img src={navb} alt="" /></div>
      <ul className="flex space-x-4">
        <button className='text-white font-normal bg-yellow-500 p-2 rounded-md'>Logout</button>
      </ul>
    </div>
  </nav>
    <div className="p-8">
    <h1 className="text-3xl text-white font-bold mb-6">Add Products</h1>
    <br />
    
    {products.map((product, index) => (
      <div key={index} className="flex items-center space-x-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
            placeholder="Product Name"
            className="border p-2 rounded-md bg-slate-500 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Quantity</label>
          <input
            type="number"
            value={product.qty}
            onChange={(e) => handleChange(index, 'qty', +e.target.value)}
            placeholder="Quantity"
            className="border p-2 rounded-md bg-slate-500 text-white"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-white">Product Price</label>
          <input
            type="number"
            value={product.rate}
            onChange={(e) => handleChange(index, 'rate', +e.target.value)}
            placeholder="Rate"
            className="border p-2 rounded-md bg-slate-500 text-white"
          />
        </div>
      </div>
    ))}

    {error && <p className="text-red-500">{error}</p>}

    <button
      onClick={handleAddProduct}
      className="bg-green-500 text-white mb-8 p-2 rounded-md hover:bg-green-600 mt-4"
    >
      Add Product
    </button>

    {/* Display products in a table */}
    {products.length > 0 && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Product List</h2>
        <table className="w-full text-left table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 border">Product Name</th>
              <th className="p-4 border">Quantity</th>
              <th className="p-4 border">Rate</th>
              <th className="p-4 border">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="bg-white">
                <td className="p-4 border">{product.name}</td>
                <td className="p-4 border">{product.qty}</td>
                <td className="p-4 border">${product.rate.toFixed(2)}</td>
                <td className="p-4 border">${(product.qty * product.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Generate PDF Button */}
        <button
          onClick={generatePDFInvoice}
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 mt-4"
        >
          Generate PDF Invoice
        </button>
      </div>
    )}
  </div>
  </div>
  );
};


export default AddProductsPage;
