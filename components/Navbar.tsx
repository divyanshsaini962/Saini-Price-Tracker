import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import Logo from '@/public/assets/icon/S.png'


const navIcons = [
  {src:'/assets/icon/search.svg', alt:'search'},
  {src:'/assets/icon/black-heart.svg', alt:'heart'},
  {src:'/assets/icon/user.svg', alt:'user'}
]
const Navbar = () => {
  return (
    <header className='w-full'>
       <nav className='nav'>
         <Link href="/" className='flex items-center gap-1'>
            <Image 
              src={Logo}
              width={200}
              height={200}
              alt='Logo'
             />
          
         </Link>
         <div className='flex items-center gap-5'>
           {navIcons.map((icon)=>(
             <Image 
               key={icon.alt}
               src={icon.src}
               alt='icon.alt'
               width={28}
               height={28}
               className='object-contain'
             />
           ))}

         </div>
         
       </nav>
    </header>
  )
}

export default Navbar