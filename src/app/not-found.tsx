import Image from 'next/image'

import image404 from '@/assets/404.png'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-full">
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold text-slate-700">ERRO 404</span>
        <h1 className="text-xl font-semibold text-slate-700">
          OOPS, PÁGINA NÃO ENCONTRADA
        </h1>
      </div>

      <div className="flex flex-col items-center">
        <Image
          src={image404}
          width={2000}
          height={968}
          quality={100}
          alt=""
          className="w-[400px]"
        />

        <span className="text-slate-700 text-lg">
          Mas... você encontrou solidariedade!
        </span>
      </div>
    </div>
  )
}
