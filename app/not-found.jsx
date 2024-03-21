import Link from 'next/link'
import { FaExclamationTriangle } from 'react-icons/fa'
export default function NotFound() {
    return (
        <div className='flex items-center justify-center h-screen bg-gradient-to-r from-[#201A48]  to-[#861453]'>
            <div className='flex flex-col items-center'>
                <FaExclamationTriangle className='mb-4 text-6xl text-white' />
                <h2 className='mb-4 text-2xl font-bold text-white'>ERROR 404</h2>
                <p className='mb-4 text-white'>No tienes permisos para esta web.</p>
                <Link href="/">
                    <button className='px-4 text-black bg-white border border-purple-500 hover:bg-slate-600 hover:text-white rounded-xl'>
                        Volver al inicio
                    </button>
                </Link>
            </div>
        </div>
    )
}