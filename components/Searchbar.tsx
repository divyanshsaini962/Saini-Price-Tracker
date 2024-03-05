"use client"
import React, { FormEvent, useState } from 'react'
import { scrapeAndStoreProduct } from '@/lib/actions';

const isValidAmazonProductURL = (url:string)=>{
  try{
   const parsedURL = new URL(url);
   const hostname = parsedURL.hostname;

  //  check if hostname amazon.com
  if(
    hostname.includes('amazon.com') ||
    hostname.includes('amazon.in')|| 
    hostname.endsWith('amazon.de')
    ){
      return true;
    }
  }catch(error){
   return false;
  }
    
}
const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLosding, setIsLoading] = useState(false);
    const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    const isValidLink = isValidAmazonProductURL(searchPrompt);
    if(!isValidLink) return alert('Please provide a valid Amazon link ')
    try{
      setIsLoading(true)

      // Scrap a product page
      const product = await scrapeAndStoreProduct(searchPrompt);
     }catch(error){
      console.log(error)
     }finally{
      setIsLoading(false)
     }
    }
  return (
    <form 
     className='flex flex-wrap gap-4 mt-12' 
     onSubmit={handleSubmit}>
     <input 
      type="text"
      value={searchPrompt}
      onChange={(e)=>setSearchPrompt(e.target.value)}
      placeholder='Enter Product Link'
      className='searchbar-input'
      />
       <button 
        type='submit'
        className='searchbar-btn'
        disabled={searchPrompt=== ''}
        >
          {isLosding ? 'Searching...': 'Search'}
        </button>
    </form>
  )
}

export default Searchbar