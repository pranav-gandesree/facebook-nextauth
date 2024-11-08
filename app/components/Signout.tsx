'use client'

import { signOut } from "next-auth/react"

const Signout = () => {
  return (
    <div>
       <button  onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-slate-500 text-white rounded">sign out</button>
    </div>
  )
}

export default Signout
