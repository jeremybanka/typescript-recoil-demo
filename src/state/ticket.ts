import { DefaultValue, atomFamily, selectorFamily, atom } from "recoil"

export type Ticket = {
  id: string
  points: 1 | 2 | 3 | 5 | 8
  concern: `bug` | `enhancement` | `feature`
}

const EMPTY_TICKET: Ticket = {
  id: ``,
  points: 1,
  concern: `bug`,
}

type History = Array<{
  label: string
  undo: () => void
  redo: () => void
}> & { marker: number }

export const history: History = (() => {
  const h = [] as unknown as History
  h.marker = -1
  return h
})()

function divergeTimeline(): void {
  for (let i = 0; i < history.marker + 1; i++) {
    history.shift()
  }
  history.marker = -1
}

export const findTicketState = atomFamily<Ticket, string>({
  key: `ticket`,
  default: EMPTY_TICKET,
  effects: (id) => [
    ({ onSet, setSelf }) => {
      onSet((newValue, oldValue) => {
        console.debug(`Current user ID:`, newValue, `:`, id)
        const atPresent = history.marker === -1
        if (!atPresent) divergeTimeline()
        history.unshift({
          label: `Set ticket ${id} to ${newValue}`,
          undo: () => setSelf(oldValue),
          redo: () => setSelf(newValue),
        })
        console.debug(`History:`, history)
      })
    },
  ],
})

export const ticketIndex = atom<string[]>({
  key: `ticketIndex`,
  default: [`foo`, `bar`],
})

export const findTicketPoints = selectorFamily<Ticket[`points`], string>({
  key: `ticketPoints`,
  get:
    (id: string) =>
    ({ get }) => {
      const ticket = get(findTicketState(id))
      return ticket.points
    },
  set:
    (id: string) =>
    ({ get, set, reset }, points: DefaultValue | Ticket[`points`]) => {
      const ticketState = findTicketState(id)
      if (points instanceof DefaultValue) {
        reset(ticketState)
        return
      }
      const ticket = get(ticketState)
      const newTicket = { ...ticket, points }
      set(ticketState, newTicket)
    },
})
