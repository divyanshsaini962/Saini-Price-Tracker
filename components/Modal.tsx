"use client"
import { useState,Fragment, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { addUserEmailToProduct } from '@/lib/actions'
// import { Props } from 'react-responsive-carousel/lib/ts/components/Thumbs'

interface Props{
  productId:string 
}

const Modal = ({productId}:Props) => {
    let [isOpen, setIsOpen] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email,setEmail] = useState('');

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     setIsSubmitting(true);

     await addUserEmailToProduct(productId,email);
      setIsSubmitting(false)
      setEmail('')
      closeModel()
    }

    const openModel = () => setIsOpen(true);
    const closeModel = ()=> setIsOpen(false);
  return (
    <>
      <button type="button" className='btn' onClick={openModel}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment} >
          <Dialog as="div" onClose={closeModel} className='dialog-container'>
             <div className='min-h-screen px-4 text-center'>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo ="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0"/>
                </Transition.Child> 
                  
                  <span className='inline-block h-screen align-middle' aria-hidden="true"/>
                    
                   
                <Transition.Child
                   as={Fragment}
                   enter="ease-out duraton-300"
                   enterFrom="opacity-0 scale-95"
                   enterTo='opacity-100 scale-100'       
                   leave="ease-in duration-200"
                   leaveFrom="opacity-100 scale-100"
                   leaveTo='opacity-0 scale-95'              
                >
                    <div className='dialog-content'>
                        <div className='flex flex-col'>
                           <div className='flex justify-between'>
                               <div className='p-3 border border-gray-200 rounded-10'>
                                  <Image 
                                    src='/assets/icon/logo.svg'
                                    alt="logo"
                                    width={28}
                                    height={28}
                                  />

                               </div>
                               <Image
                                 src="/assets/icon/x-close.svg"
                                 className="cursor-pointer"
                                 width={28}
                                 height={28}
                                 alt='close'
                                 onClick={closeModel}
                               />
                              </div>
                               <h4 className='dialog-head_text'>
                                Stay updated with Product pricing alerts right in your inbox!
                               </h4>
                                <p className="text-sm text-gray-600 mt-2">
                                    Never miss a bargin again with our timely alerts!
                                </p>
                                <form className='flex flex-col mt-5' onSubmit={handleSubmit}>
                                    <label htmlFor="email" className='text-sm font-medium text-gray-700'>
                                        Email address
                                    </label>
                                    <div className='dialog-input_container'>
                                       <Image
                                         src="/assets/icon/mail.svg"
                                         width={18}
                                         height={18}
                                         alt="mail-img"
                                       />
                                       <input
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        id='email'
                                        type='email'
                                        placeholder='Enter your email address'
                                        className='dialog_input outline-none'
                                       />
                                    </div>
                                     <button type='submit' className='dialog-btn'>
                                        {isSubmitting ? 'Submitting...' : 'Track'}
                                     </button>
                                </form>
                        </div>

                    </div>

                </Transition.Child>
             </div>
          </Dialog>
      </Transition>

         
    </>
  )
}

export default Modal