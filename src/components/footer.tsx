import Link from 'next/link'

export function Footer() {
  return (
    <div className="flex justify-between items-center gap-2 px-20 py-4 bg-slate-600">
      <div className="flex flex-col">
        <span className="text-sm text-slate-300">
          &copy; 2024 - Trabalho Desenvolvimento Web
        </span>
        <span className="text-sm text-slate-300">
          Universidade Federal de Santa Maria - UFSM
        </span>
      </div>

      <span className="text-sm text-slate-300">
        Desenvolvido por{' '}
        <Link
          href="https://github.com/wedersonf"
          target="_blank"
          className="hover:text-slate-200"
        >
          Wederson Fagundes
        </Link>
      </span>
    </div>
  )
}
