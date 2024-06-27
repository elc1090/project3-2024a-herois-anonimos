import Link from 'next/link'

export default async function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between">
        <h1 className="font-bold text-slate-600 uppercase text-xl">
          Minhas publicações
        </h1>

        <Link
          href="/dashboard/post"
          className="border border-slate-700 text-slate-700 px-4 py-2 rounded hover:bg-slate-200"
        >
          Criar uma publicação
        </Link>
      </div>

      <div className="flex flex-col w-full gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <article
            key={index}
            className="bg-white/40 border animate-pulse border-slate-300 px-4 py-2 h-20 rounded shadow flex justify-between items-center"
          >
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-slate-300 h-5 w-96" />
              <div className="h-[14px] bg-slate-300 w-60" />
            </div>

            <div className="flex gap-4">
              <div className="w-[105px] h-10 bg-slate-300 rounded-sm" />
              <div className="w-[105px] h-10 bg-slate-300 rounded-sm" />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
