import type { FC } from "react"
import { useState } from "react"

import { Routes, Route, Outlet, Link } from "react-router-dom"
import { atom, useRecoilState, useRecoilValue } from "recoil"

import { DebugInspector } from "./DebugInspector"
import { RadioButtons } from "./RecoilRadioButtons"
import {
  findTicketPoints,
  findTicketState,
  history,
  ticketIndex,
} from "./state/ticket"

export const App: FC = () => {
  return (
    <div>
      <h1>Basic Example</h1>

      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
      <DebugInspector />
    </div>
  )
}

function Layout() {
  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li>
        </ul>
        <button
          onClick={() => {
            history.marker += 1
            history[history.marker]?.undo()
          }}
        >
          Undo
        </button>
        <button
          onClick={() => {
            history.marker -= 1
            history[history.marker + 1]?.redo()
          }}
        >
          Redo
        </button>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  )
}

function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  return (
    <div style={{ background: isDarkMode ? `black` : `white` }}>
      <button onClick={() => setIsDarkMode(true)}></button>
      <h2>Home</h2>
    </div>
  )
}

type Profile = {
  firstName: string
  lastName: string
}

export const profileState = atom<Profile | undefined>({
  key: `profile`,
  default: undefined,
})

function About() {
  const [profile, setProfile] = useRecoilState(profileState)
  return (
    <div>
      <h2>About</h2>
    </div>
  )
}

function Dashboard() {
  const ticketIds = useRecoilValue(ticketIndex)
  return (
    <>
      {ticketIds.map((id) => (
        <TicketPanel key={id} id={id} />
      ))}
    </>
  )
}

const TicketPanel: FC<{ id: string }> = ({ id }) => {
  const ticketPointsState = findTicketPoints(id)
  return (
    <div>
      <RadioButtons state={ticketPointsState} options={[1, 2, 3, 5, 8]} />
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
